using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Application.Models;

namespace OpenSystem.Core.Application.Queries
{
    public interface IQueryListHandler<TRequest, TData> : IQueryHandler<TRequest, Paged<TData>>
        where TRequest : IQuery<Paged<TData>> { }
}
