namespace OpenSystem.Core.Domain.Common
{
    public class LoadedVersions<T> : ILoadedVersions<T>
    {
        public IReadOnlyCollection<Type> Items { get; }

        public LoadedVersions(IEnumerable<Type> items)
        {
            Items = items.ToList();
        }
    }
}
