package kz.ilotterytea.bot.api.commands.responses;

/**
 * Code for response exceptions.
 * @author ilotterytea
 * @since 1.5.1
 */
public enum ResponseExceptionCode {
    NOT_ENOUGH_ARGUMENTS,
    WRONG_ARGUMENT_TYPE,
    INCORRECT_ARGUMENT,

    INCOMPATIBLE_NAME,
    NAMESAKE_CREATION,
    NOT_FOUND,

    SOMETHING_WENT_WRONG,

    EXTERNAL_API_ERROR,
    INSUFFICIENT_RIGHTS
}
