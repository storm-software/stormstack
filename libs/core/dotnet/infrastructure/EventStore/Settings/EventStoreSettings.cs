namespace OpenSystem.Core.Infrastructure.EventStore.Settings
{
    public class EventStoreSettings : IEventStoreSettings
    {
        public TimeSpan? QueryDeadline { get; set; } = TimeSpan.FromMilliseconds(100);

        public int QueryMaxCount { get; set; } = 50;
    }
}
