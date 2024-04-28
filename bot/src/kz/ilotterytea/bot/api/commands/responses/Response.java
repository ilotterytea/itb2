package kz.ilotterytea.bot.api.commands.responses;

import java.util.ArrayList;
import java.util.Optional;

/**
 * Command response.
 * @author ilotterytea
 * @since 1.5.1
 */
public class Response {
    private final String single;
    private final ArrayList<String> multiple;

    private Response(String single) {
        this.single = single;
        this.multiple = null;
    }

    private Response(ArrayList<String> multiple) {
        this.single = null;
        this.multiple = multiple;
    }

    public static Response multiple(ArrayList<String> multiple) {
        return new Response(multiple);
    }

    public static Response single(String single) {
        return new Response(single);
    }

    public Optional<String> getSingle() {
        return Optional.ofNullable(this.single);
    }

    public Optional<ArrayList<String>> getMultiple() {
        return Optional.ofNullable(this.multiple);
    }
}
