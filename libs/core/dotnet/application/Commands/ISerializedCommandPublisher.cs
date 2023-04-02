using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Application.Commands
{
    public interface ISerializedCommandPublisher
    {
        Task<ISourceId> PublishSerializedCommandAsync(
            string name,
            uint version,
            string json,
            CancellationToken cancellationToken
        );
    }
}
