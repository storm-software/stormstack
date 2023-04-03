using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.ReadStores
{
    public interface IReadModelContextFactory
    {
        IReadModelContext Create(string readModelId, bool isNew);
    }
}
