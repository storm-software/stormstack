namespace OpenSystem.Core.Domain.Common
{
    public interface IIndexed<in TIdentity>
        where TIdentity : IIdentity
    {
        public IIdentity Id { get; set; }
    }
}
