using MediatR;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Application.Interfaces
{
    public interface ICommandHandler<TRequest> : IRequestHandler<TRequest, IVersionedIndex>
        where TRequest : ICommand { }
}
