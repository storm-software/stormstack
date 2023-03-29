namespace OpenSystem.Core.Domain.Enums
{
    public enum CancellationBoundaryTypes
    {
        BeforeUpdatingAggregate,
        BeforeCommittingEvents,
        BeforeUpdatingReadStores,
        BeforeNotifyingSubscribers,
        CancelAlways
    }
}
