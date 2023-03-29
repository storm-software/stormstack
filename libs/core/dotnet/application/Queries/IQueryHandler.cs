using OpenSystem.Core.Application.Models;
using MediatR;

namespace OpenSystem.Core.Application.Queries
{
    public interface IQueryHandler<in TRequest, TResponse> : IRequestHandler<TRequest, TResponse>
        where TRequest : IQuery<TResponse> { }
}
