using OpenSystem.Core.Application.Queries;
using OpenSystem.Core.Application.ReadStores;

namespace OpenSystem.Core.Infrastructure.ReadStores.InMemory
{
    public class InMemoryQuery<TReadModel> : IQuery<IReadOnlyCollection<TReadModel>>
        where TReadModel : IReadModel
    {
        public Predicate<TReadModel> Query { get; }

        public InMemoryQuery(Predicate<TReadModel> query)
        {
            Query = query;
        }
    }
}
