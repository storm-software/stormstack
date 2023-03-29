using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Core.Domain.Settings
{
    public interface IEventSourcingSettings : ICancellationSettings
    {
        int NumberOfRetriesOnOptimisticConcurrencyExceptions { get; set; }

        TimeSpan? DelayBeforeRetryOnOptimisticConcurrencyExceptions { get; set; }

        bool ForwardOptimisticConcurrencyExceptions { get; set; }

        bool ThrowSubscriberExceptions { get; set; }

        bool IsAsynchronousSubscribersEnabled { get; set; }

        int PopulateReadModelEventPageSize { get; set; }
    }
}
