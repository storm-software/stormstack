using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Application.Models;
using OpenSystem.Core.Domain.ReadStores;

namespace OpenSystem.Core.Application.Queries
{
    public interface IQueryListHandler<TRequest, TPagedListReadModel, TData>
        : IQueryHandler<TRequest, TPagedListReadModel>
        where TRequest : class, IQuery<TPagedListReadModel>
        where TPagedListReadModel : PagedListReadModel<TData> { }
}
