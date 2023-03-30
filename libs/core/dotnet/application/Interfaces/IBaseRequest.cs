using MediatR;

namespace OpenSystem.Core.Application.Interfaces
{
    public interface IBaseRequest<out TResponse> : IRequest<TResponse> { }
}
