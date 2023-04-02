namespace OpenSystem.Core.Domain.Common
{
    public class Indexed<TIdentity> : IIndexed<TIdentity>
        where TIdentity : IIdentity
    {
        public IIdentity Id { get; set; }
    }
}
