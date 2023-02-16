using MediatR;

namespace OpenSystem.Core.Application.Interfaces
{
   public interface IQuery<TResponse>
    : IRequest<TResponse>
  {
  }
}
