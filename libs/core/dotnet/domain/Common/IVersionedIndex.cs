namespace OpenSystem.Core.Domain.Common
{
    public interface IVersionedIndex<in TIdentity> : IVersioned, IIndexed<TIdentity>
        where TIdentity : IIdentity { }
}
