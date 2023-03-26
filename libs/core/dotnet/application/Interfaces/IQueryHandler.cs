using MediatR;

namespace OpenSystem.Core.Application.Interfaces
{
    public interface IQueryHandler<TRequest, TResponse> : IRequestHandler<TRequest, TResponse>
        where TRequest : IQuery<TResponse> { }
}
