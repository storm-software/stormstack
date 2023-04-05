using OpenSystem.Core.Application.Commands.Attributes;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Commands
{
    public interface ICommandDefinitionService
        : IVersionDefinitionService<CommandVersionAttribute, CommandDefinition> { }
}
