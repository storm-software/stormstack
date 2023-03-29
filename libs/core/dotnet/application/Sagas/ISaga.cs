using OpenSystem.Core.Application.Commands;
using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Core.Application.Sagas
{
    public interface ISaga
    {
        SagaStateTypes State { get; }

        Task PublishAsync(ICommandBus commandBus, CancellationToken cancellationToken);
    }

    public interface ISaga<TLocator> : ISaga
        where TLocator : ISagaLocator { }
}
