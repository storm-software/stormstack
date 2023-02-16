using MediatR;

namespace OpenSystem.Core.Application.Interfaces
{
   public interface Command
    : IRequest<ICommandSuccessResponse>
  {

  }
}
