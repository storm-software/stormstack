namespace OpenSystem.Core.Application.Interfaces
{
    using OpenSystem.Core.Domain.ValueObjects;

    public interface IBaseRequest
    {
        UserId UserId { get; set; }
    }

    public interface IBaseRequest<out TResponse> : IBaseRequest, MediatR.IRequest<TResponse> { }
}
