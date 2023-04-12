using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Application.Queries;
using OpenSystem.Core.Application.ReadStores;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Infrastructure.ReadStores
{
    public class InMemoryQuery<TReadModel> : IQuery<IReadOnlyCollection<TReadModel>>
        where TReadModel : IReadModel
    {
        public Predicate<TReadModel> Query { get; }

        public UserId UserId { get; set; }

        public InMemoryQuery(Predicate<TReadModel> query)
        {
            Query = query;
        }
    }
}
