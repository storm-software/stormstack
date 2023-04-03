using OpenSystem.Core.Application.Models;
using MediatR;
using OpenSystem.Core.Application.ReadStores;

namespace OpenSystem.Core.Application.Queries
{
    public interface IQueryHandler<in TRequest, TData> : IRequestHandler<TRequest, TData>
        where TRequest : IQuery<TData> { }
}
