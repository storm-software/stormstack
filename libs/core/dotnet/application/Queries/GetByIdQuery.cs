using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Application.ReadStores;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Application.Queries
{
    public class GetByIdQuery<TData> : IQuery<TData>
    {
        public string Id { get; }

        public GetByIdQuery(IIdentity identity)
            : this(identity.Value) { }

        public GetByIdQuery(string id)
        {
            if (string.IsNullOrEmpty(id))
                throw new ArgumentNullException(nameof(id));

            Id = id;
        }
    }
}
