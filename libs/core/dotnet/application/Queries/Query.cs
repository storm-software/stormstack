using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Queries
{
    public abstract class Query<TData> : IQuery<TData>
    {
        public UserId UserId { get; set; }
    }
}
