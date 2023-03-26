using MediatR;

namespace OpenSystem.Core.Application.Interfaces
{
    public interface IBaseRequest<TResponse> : IRequest<TResponse> { }
}
