package kz.ilotterytea.bot;

import com.github.philippheuer.credentialmanager.domain.OAuth2Credential;
import com.github.twitch4j.TwitchClient;
import com.github.twitch4j.TwitchClientBuilder;
import com.github.twitch4j.chat.events.channel.IRCMessageEvent;
import com.github.twitch4j.events.ChannelGoLiveEvent;
import com.github.twitch4j.events.ChannelGoOfflineEvent;
import com.github.twitch4j.helix.domain.User;
import kz.ilotterytea.bot.api.commands.CommandLoader;
import kz.ilotterytea.bot.entities.channels.Channel;
import kz.ilotterytea.bot.entities.channels.ChannelPreferences;
import kz.ilotterytea.bot.entities.events.Event;
import kz.ilotterytea.bot.handlers.MessageHandlerSamples;
import kz.ilotterytea.bot.handlers.StreamEventHandlers;
import kz.ilotterytea.bot.i18n.I18N;
import kz.ilotterytea.bot.thirdpartythings.seventv.eventapi.SevenTVEventAPIClient;
import kz.ilotterytea.bot.utils.HibernateUtil;
import kz.ilotterytea.bot.utils.StorageUtils;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.net.URISyntaxException;
import java.util.stream.Collectors;

/**
 * Bot.
 * @author ilotterytea
 * @since 1.0
 */
public class Huinyabot extends Bot {
    private TwitchClient client;
    private CommandLoader loader;
    private SevenTVEventAPIClient sevenTV;
    private OAuth2Credential credential;
    private I18N i18N;

    private final Logger LOGGER = LoggerFactory.getLogger(Huinyabot.class);

    public TwitchClient getClient() { return client; }
    public CommandLoader getLoader() { return loader; }
    public OAuth2Credential getCredential() { return credential; }
    public I18N getLocale() { return i18N; }

    private static Huinyabot instance;
    public static Huinyabot getInstance() { return instance; }
    public Huinyabot() { instance = this; }

    @Override
    public void init() {
        if (SharedConstants.TWITCH_OAUTH2_TOKEN == null) {
            LOGGER.error("No Twitch OAuth2 token has been provided!");
            return;
        }
        loader = new CommandLoader();
        i18N = new I18N(StorageUtils.getFilepathsFromResource("/i18n"));

        try {
            sevenTV = new SevenTVEventAPIClient();
            sevenTV.connectBlocking();
        } catch (URISyntaxException | InterruptedException e) {
            throw new RuntimeException(e);
        }

        // - - -  T W I T C H  C L I E N T  - - - :
        credential = new OAuth2Credential("twitch", SharedConstants.TWITCH_OAUTH2_TOKEN);

        client = TwitchClientBuilder.builder()
                .withChatAccount(credential)
                .withDefaultAuthToken(credential)
                .withEnableTMI(true)
                .withEnableChat(true)
                .withEnableHelix(true)
                .build();

        client.getChat().connect();

        Session session = HibernateUtil.getSessionFactory().openSession();

        // Join bot's chat:
        if (credential.getUserName() != null && credential.getUserId() != null) {
            client.getChat().joinChannel(credential.getUserName());
            LOGGER.debug("Joined to bot's chat room!");

            // Generate a new channel for bot if it doesn't exist:
            List<Channel> channels = session.createQuery("from Channel where aliasId = :aliasId", Channel.class)
                    .setParameter("aliasId", credential.getUserId())
                    .getResultList();

            if (channels.isEmpty()) {
                LOGGER.debug("The bot doesn't have a channel entry. Creating a new one...");

                Channel channel = new Channel(Integer.parseInt(credential.getUserId()), credential.getUserName());
                ChannelPreferences preferences = new ChannelPreferences(channel);
                channel.setPreferences(preferences);

                session.getTransaction().begin();
                session.persist(channel);
                session.persist(preferences);
                session.getTransaction().commit();
            }
        }

        // Obtaining the channels:
        List<Channel> channels = session.createQuery("from Channel where optOutTimestamp is null", Channel.class).getResultList();

        if (!channels.isEmpty()) {
            List<User> twitchChannels = client.getHelix().getUsers(
                    credential.getAccessToken(),
                    channels.stream().map(c -> c.getAliasId().toString()).collect(Collectors.toList()),
                    null
            ).execute().getUsers();

            // Join channel chats:
            for (User twitchChannel : twitchChannels) {
                client.getChat().joinChannel(twitchChannel.getLogin());
                LOGGER.debug("Joined to " + twitchChannel.getLogin() + "'s chat room!");
            }
        }

        // Obtaining to stream events:
        List<Event> streamEvents = session.createQuery("from Event where eventType > 0 AND eventType <= 2", Event.class).getResultList();

        if (!streamEvents.isEmpty()) {
            Set<Integer> eventIds = new HashSet<>();

            for (Event streamEvent : streamEvents) {
                eventIds.add(streamEvent.getAliasId());
            }

            // Getting Twitch info about the stream events:
            List<User> listenableUsers = client.getHelix().getUsers(
                    credential.getAccessToken(),
                    eventIds.stream().map(Object::toString).collect(Collectors.toList()),
                    null
            ).execute().getUsers();

            // Listening to stream events:
            for (User listenableUser : listenableUsers) {
                client.getClientHelper().enableStreamEventListener(listenableUser.getId(), listenableUser.getLogin());
                LOGGER.debug("Listening for stream events for user " + listenableUser.getLogin());
            }
        }

        session.close();

        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                try {
                    Session session1 = HibernateUtil.getSessionFactory().openSession();
                    final Date CURRENT_DATE = new Date();

                    List<kz.ilotterytea.bot.entities.Timer> timers = session1.createQuery("from Timer", kz.ilotterytea.bot.entities.Timer.class).getResultList();

                    session1.getTransaction().begin();

                    for (kz.ilotterytea.bot.entities.Timer timer : timers) {
                        if (CURRENT_DATE.getTime() - timer.getLastTimeExecuted().getTime() > timer.getIntervalMilliseconds()) {
                            client.getChat().sendMessage(
                                    timer.getChannel().getAliasName(),
                                    timer.getMessage()
                            );

                            timer.setLastTimeExecuted(new Date());
                            session1.persist(timer);
                        }
                    }

                    session1.getTransaction().commit();
                    session1.close();
                } catch (HibernateException e) {
                    LOGGER.error("Failed to run timers", e);
                }
            }
        }, 2500, 2500);

        client.getEventManager().onEvent(IRCMessageEvent.class, MessageHandlerSamples::ircMessageEvent);

        // Handling stream events:
        client.getEventManager().onEvent(ChannelGoLiveEvent.class, StreamEventHandlers::handleGoLiveEvent);
        client.getEventManager().onEvent(ChannelGoOfflineEvent.class, StreamEventHandlers::handleGoOfflineEvent);
    }

    @Override
    public void dispose() {
        client.close();
        sevenTV.close();
    }
}
