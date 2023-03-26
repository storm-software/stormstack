using MediatR;

namespace OpenSystem.Core.Application.Interfaces
{
    public interface IBaseHandler<in TRequest, TReturn> : IRequestHandler<TRequest, TReturn>
        where TRequest : IBaseRequest<TReturn> { }
}
