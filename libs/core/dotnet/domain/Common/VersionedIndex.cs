namespace OpenSystem.Core.Domain.Common
{
    public class VersionedIndex<T> : Indexed<T>, IVersionedIndex<T>
    {
        public T Id { get; set; }

        public uint Version { get; set; } = 0;
    }

    public class VersionedIndex : VersionedIndex<Guid>, IVersionedIndex { }
}
