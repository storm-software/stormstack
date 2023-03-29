using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Domain.ReadStores
{
    public interface IReadModelLocator
    {
        IEnumerable<string> GetReadModelIds(IDomainEvent domainEvent);
    }
}
