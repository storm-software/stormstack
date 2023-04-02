using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.ValueObjects;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Application.Commands
{
    public class SerializedCommandPublisher : ISerializedCommandPublisher
    {
        private readonly ILogger<SerializedCommandPublisher> _logger;
        private readonly ICommandDefinitionService _commandDefinitionService;
        private readonly IJsonSerializer _jsonSerializer;
        private readonly ICommandBus _commandBus;

        public SerializedCommandPublisher(
            ILogger<SerializedCommandPublisher> logger,
            ICommandDefinitionService commandDefinitionService,
            IJsonSerializer jsonSerializer,
            ICommandBus commandBus
        )
        {
            _logger = logger;
            _commandDefinitionService = commandDefinitionService;
            _jsonSerializer = jsonSerializer;
            _commandBus = commandBus;
        }

        public async Task<ISourceId> PublishSerializedCommandAsync(
            string name,
            uint version,
            string json,
            CancellationToken cancellationToken
        )
        {
            if (string.IsNullOrEmpty(name))
                throw new ArgumentNullException(nameof(name));
            if (version <= 0)
                throw new ArgumentOutOfRangeException(nameof(version));
            if (string.IsNullOrEmpty(json))
                throw new ArgumentNullException(nameof(json));

            _logger.LogTrace(
                "Executing serialized command {CommandName} v{Version}",
                name,
                version
            );

            if (
                !_commandDefinitionService.TryGetDefinition(
                    name,
                    version,
                    out var commandDefinition
                )
            )
            {
                throw new ArgumentException(
                    $"No command definition found for command '{name}' v{version}"
                );
            }

            ICommand command;
            try
            {
                command = (ICommand)_jsonSerializer.Deserialize(json, commandDefinition.Type);
            }
            catch (Exception e)
            {
                throw new ArgumentException(
                    $"Failed to deserialize command '{name}' v{version}: {e.Message}",
                    e
                );
            }

            await command.PublishAsync(_commandBus, CancellationToken.None).ConfigureAwait(false);
            return command.GetSourceId();
        }
    }
}
