namespace OpenSystem.Core.Domain.Settings
{
    public interface ILoadedVersions
    {
        IReadOnlyCollection<Type> Jobs { get; }

        IReadOnlyCollection<Type> Commands { get; }

        IReadOnlyCollection<Type> Events { get; }

        IReadOnlyCollection<Type> Sagas { get; }

        IReadOnlyCollection<Type> SnapshotTypes { get; }
    }
}
