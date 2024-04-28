package kz.ilotterytea.bot.api.commands.responses;

/**
 * Exception for command responses.
 * @author ilotterytea
 * @since 1.5.1
 */
public class ResponseException extends Exception {
    private final ResponseExceptionCode code;

    public ResponseException(ResponseExceptionCode code, String message) {
        super(message);
        this.code = code;
    }

    public ResponseExceptionCode getCode() {
        return code;
    }
}
