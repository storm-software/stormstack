using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Commands
{
    public interface ISerializedCommandPublisher
    {
        Task<SourceId> PublishSerializedCommandAsync(
            string name,
            uint version,
            string json,
            CancellationToken cancellationToken
        );
    }
}
