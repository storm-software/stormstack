using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.ReadStores
{
    public interface IReadModelLocator
    {
        IEnumerable<string> GetReadModelIds(IDomainEvent domainEvent);
    }
}
