using System.Diagnostics;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Utilities
{
    public class TransientFaultHandler<TRetryStrategy> : ITransientFaultHandler<TRetryStrategy>
        where TRetryStrategy : IRetryStrategy
    {
        private readonly ILogger<TransientFaultHandler<TRetryStrategy>> _logger;
        private readonly TRetryStrategy? _retryStrategy;

        public TransientFaultHandler(
            ILogger<TransientFaultHandler<TRetryStrategy>> logger,
            TRetryStrategy? retryStrategy
        )
        {
            _logger = logger;
            _retryStrategy = retryStrategy;
        }

        public void ConfigureRetryStrategy(Action<TRetryStrategy> configureStrategy)
        {
            if (configureStrategy == null)
            {
                throw new ArgumentNullException(nameof(configureStrategy));
            }

            if (_retryStrategy == null)
                throw new InvalidOperationException(
                    "You need to configure a retry strategy method"
                );

            configureStrategy(_retryStrategy);
        }

        public Task TryAsync(
            Func<CancellationToken, Task> action,
            Label label,
            CancellationToken cancellationToken
        )
        {
            return TryAsync<object>(
                async c =>
                {
                    await action(c).ConfigureAwait(false);
                    return null;
                },
                label,
                cancellationToken
            );
        }

        public async Task<T> TryAsync<T>(
            Func<CancellationToken, Task<T>> action,
            Label label,
            CancellationToken cancellationToken
        )
        {
            if (_retryStrategy == null)
            {
                throw new InvalidOperationException(
                    "You need to configure the retry strategy using the Use(...) method"
                );
            }

            var stopwatch = Stopwatch.StartNew();
            var currentRetryCount = 0;

            while (true)
            {
                Exception currentException;
                Retry retry;
                try
                {
                    var result = await action(cancellationToken).ConfigureAwait(false);
                    _logger.LogInformation(
                        "Finished execution of {Label} after {RetryCount} retries and {Seconds} seconds",
                        label,
                        currentRetryCount,
                        stopwatch.Elapsed.TotalSeconds
                    );
                    return result;
                }
                catch (Exception exception)
                {
                    currentException = exception;
                    var currentTime = stopwatch.Elapsed;
                    retry = _retryStrategy.ShouldThisBeRetried(
                        currentException,
                        currentTime,
                        currentRetryCount
                    );
                    if (!retry.ShouldBeRetried)
                    {
                        throw;
                    }
                }

                currentRetryCount++;
                if (retry.RetryAfter != TimeSpan.Zero)
                {
                    _logger.LogWarning(
                        "Exception {ExceptionType} with message {ExceptionMessage} is transient, retrying action {Label} after {Seconds} seconds for retry count {RetryCount}",
                        currentException.GetType().PrettyPrint(),
                        currentException.Message,
                        label,
                        retry.RetryAfter.TotalSeconds,
                        currentRetryCount
                    );
                    await Task.Delay(retry.RetryAfter, cancellationToken).ConfigureAwait(false);
                }
                else
                {
                    _logger.LogWarning(
                        "Exception {ExceptionType} with message {ExceptionMessage} is transient, retrying action {Label} NOW for retry count {RetryCount}",
                        currentException.GetType().PrettyPrint(),
                        currentException.Message,
                        label,
                        currentRetryCount
                    );
                }
            }
        }
    }
}
