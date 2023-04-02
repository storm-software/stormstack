using Microsoft.Extensions.Logging;
using OpenSystem.Core.Application.Attributes;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Commands
{
    public class CommandDefinitionService
        : BaseVersionDefinitionService<ICommand, CommandVersionAttribute, CommandDefinition>,
            ICommandDefinitionService
    {
        public CommandDefinitionService(
            ILogger<CommandDefinitionService> logger,
            ILoadedVersions<ICommand> loadedVersions
        )
            : base(logger)
        {
            Load(loadedVersions.Items);
        }

        protected override CommandDefinition CreateDefinition(uint version, Type type, string name)
        {
            return new CommandDefinition(version, type, name);
        }
    }
}
