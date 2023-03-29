namespace OpenSystem.Core.Domain.Settings
{
    public class LoadedVersions : ILoadedVersions
    {
        public IReadOnlyCollection<Type> Jobs { get; }

        public IReadOnlyCollection<Type> Commands { get; }

        public IReadOnlyCollection<Type> Events { get; }

        public IReadOnlyCollection<Type> Sagas { get; }

        public IReadOnlyCollection<Type> SnapshotTypes { get; }

        public LoadedVersions(
            IEnumerable<Type> jobTypes,
            IEnumerable<Type> commandTypes,
            IEnumerable<Type> eventTypes,
            IEnumerable<Type> sagaTypes,
            IEnumerable<Type> snapshotTypes
        )
        {
            Jobs = jobTypes.ToList();
            Commands = commandTypes.ToList();
            Events = eventTypes.ToList();
            Sagas = sagaTypes.ToList();
            SnapshotTypes = snapshotTypes.ToList();
        }
    }
}
