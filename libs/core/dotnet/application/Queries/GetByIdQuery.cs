using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Application.ReadStores;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Queries
{
    public class GetByIdQuery<TData, TIdentity> : Query<TData>, IIndexed<TIdentity>
        where TIdentity : IIdentity
    {
        public IIdentity Id { get; set; }

        public GetByIdQuery(IIdentity id)
        {
            Id = id;
        }
    }
}
