using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Commands
{
    public class CommandId : Identity<CommandId>, ISourceId
    {
        public CommandId(string value)
            : base(value) { }

        public static implicit operator CommandId(string guid) => new CommandId(guid);

        public static implicit operator string(CommandId commandId) => commandId.Value;
    }
}
