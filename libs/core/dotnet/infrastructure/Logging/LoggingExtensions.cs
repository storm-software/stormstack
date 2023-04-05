using System.Diagnostics;
using Microsoft.Extensions.Logging;

namespace OpenSystem.Core.Infrastructure.Logging
{
    public static class LoggingExtensions
    {
        /// <summary>
        /// Checks if the trace level is enabled.
        /// </summary>
        /// <returns><c>true</c> if enabled.</returns>
        public static bool IsTraceEnabled(this ILogger logger) => logger.IsEnabled(LogLevel.Trace);

        /// <summary>
        /// Checks if the debug level is enabled.
        /// </summary>
        /// <returns><c>true</c> if enabled.</returns>
        public static bool IsDebugEnabled(this ILogger logger) => logger.IsEnabled(LogLevel.Debug);

        /// <summary>
        /// Checks if the information level is enabled.
        /// </summary>
        /// <returns><c>true</c> if enabled.</returns>
        public static bool IsInformationEnabled(this ILogger logger) =>
            logger.IsEnabled(LogLevel.Information);

        /// <summary>
        /// Checks if the warning level is enabled.
        /// </summary>
        /// <returns><c>true</c> if enabled.</returns>
        public static bool IsWarningEnabled(this ILogger logger) =>
            logger.IsEnabled(LogLevel.Warning);

        /// <summary>
        /// Checks if the error level is enabled.
        /// </summary>
        /// <returns><c>true</c> if enabled.</returns>
        public static bool IsErrorEnabled(this ILogger logger) => logger.IsEnabled(LogLevel.Error);

        /// <summary>
        /// Checks if the critical level is enabled.
        /// </summary>
        /// <returns><c>true</c> if enabled.</returns>
        public static bool IsCriticalEnabled(this ILogger logger) =>
            logger.IsEnabled(LogLevel.Critical);

        private static readonly Action<ILogger, Exception> _unhandledException =
            LoggerMessage.Define(
                LogLevel.Error,
                new EventId(1, "UnhandledException"),
                "An unhandled exception has occurred while executing the request."
            );

        private static readonly Action<ILogger, Exception?> _responseStarted = LoggerMessage.Define(
            LogLevel.Warning,
            new EventId(2, "ResponseStarted"),
            "The response has already started, the problem details middleware will not be executed."
        );

        private static readonly Action<ILogger, Exception> _problemDetailsFactoryException =
            LoggerMessage.Define(
                LogLevel.Error,
                new EventId(3, "Exception"),
                "An exception was thrown attempting to execute the problem details middleware."
            );

        private static readonly Action<ILogger, Exception> _ignoredException = LoggerMessage.Define(
            LogLevel.Information,
            new EventId(4, "IgnoredException"),
            "An exception has occurred while executing the request, but it was ignored by custom mapping rules."
        );

        public static void UnhandledException(this ILogger logger, Exception exception)
        {
            _unhandledException(logger, exception.Demystify());
        }

        public static void ResponseStarted(this ILogger logger)
        {
            _responseStarted(logger, null);
        }

        public static void ProblemDetailsFactoryException(this ILogger logger, Exception exception)
        {
            _problemDetailsFactoryException(logger, exception.Demystify());
        }

        public static void IgnoredException(this ILogger logger, Exception exception)
        {
            _ignoredException(logger, exception.Demystify());
        }
    }
}
