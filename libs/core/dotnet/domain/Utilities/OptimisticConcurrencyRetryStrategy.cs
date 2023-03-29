using System.Collections;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.Settings;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Utilities
{
    public class OptimisticConcurrencyRetryStrategy : IOptimisticConcurrencyRetryStrategy
    {
        private readonly EventSourcingSettings _configuration;

        public OptimisticConcurrencyRetryStrategy(EventSourcingSettings configuration)
        {
            _configuration = configuration;
        }

        public Retry ShouldThisBeRetried(
            Exception exception,
            TimeSpan totalExecutionTime,
            int currentRetryCount
        )
        {
            if (!(exception is OptimisticConcurrencyException))
                return Retry.No;

            return
                _configuration != null
                && _configuration.NumberOfRetriesOnOptimisticConcurrencyExceptions
                    >= currentRetryCount
                ? Retry.YesAfter(
                    _configuration.DelayBeforeRetryOnOptimisticConcurrencyExceptions
                        ?? TimeSpan.FromMilliseconds(100)
                )
                : Retry.No;
        }
    }
}
