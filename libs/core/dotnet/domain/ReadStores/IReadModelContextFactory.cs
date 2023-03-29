using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Domain.ReadStores
{
    public interface IReadModelContextFactory
    {
        IReadModelContext Create(string readModelId, bool isNew);
    }
}
