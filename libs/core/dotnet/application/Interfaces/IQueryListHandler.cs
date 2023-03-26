using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Application.Interfaces
{
    public interface IQueryListHandler<TRequest, TData> : IQueryHandler<TRequest, Paged<TData>>
        where TRequest : IQuery<Paged<TData>> { }
}
