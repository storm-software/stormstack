namespace OpenSystem.Core.Domain.Common
{
    public interface IVersionedIndex<T> : IVersioned, IIndexed<T> { }

    public interface IVersionedIndex : IVersioned, IIndexed { }
}
