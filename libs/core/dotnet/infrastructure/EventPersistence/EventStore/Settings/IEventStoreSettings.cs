namespace OpenSystem.Core.Infrastructure.EventPersistence.EventStore.Settings
{
    public interface IEventStoreSettings
    {
        TimeSpan? QueryDeadline { get; set; }

        int QueryMaxCount { get; set; }
    }
}
