using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Core.Domain.Settings
{
    public class EventSourcingSettings : IEventSourcingSettings
    {
        public int NumberOfRetriesOnOptimisticConcurrencyExceptions { get; set; } = 4;

        public TimeSpan? DelayBeforeRetryOnOptimisticConcurrencyExceptions { get; set; } =
            TimeSpan.FromMilliseconds(100);

        public bool ForwardOptimisticConcurrencyExceptions { get; set; } = false;

        public bool ThrowSubscriberExceptions { get; set; } = false;

        public bool IsAsynchronousSubscribersEnabled { get; set; } = false;

        public CancellationBoundaryTypes CancellationBoundary { get; set; } =
            CancellationBoundaryTypes.BeforeCommittingEvents;

        public int PopulateReadModelEventPageSize { get; set; } = 200;
    }
}
