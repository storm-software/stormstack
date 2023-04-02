namespace OpenSystem.Core.Domain.Common
{
    public interface ILoadedVersions<T>
    {
        IReadOnlyCollection<Type> Items { get; }
    }
}
