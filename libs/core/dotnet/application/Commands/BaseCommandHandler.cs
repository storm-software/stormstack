using AutoMapper;
using MediatR;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Common;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Application.Interfaces;

namespace OpenSystem.Reaction.Application.Commands
{
    public abstract class BaseCommandHandler<TRequest, TEntity> : ICommandHandler<TRequest>
        where TRequest : ICommand
        where TEntity : AggregateRoot
    {
        protected IMapper Mapper { get; set; }

        protected ILogger<BaseCommandHandler<TRequest, TEntity>> Logger { get; set; }

        public BaseCommandHandler(
            IMapper mapper,
            ILogger<BaseCommandHandler<TRequest, TEntity>> logger
        )
        {
            Mapper = mapper;
            Logger = logger;
        }

        public async Task<IVersionedIndex> Handle(
            TRequest request,
            CancellationToken cancellationToken
        )
        {
            Logger.LogDebug($"Command processing: {request.GetType().Name}");

            TEntity entity = await MapRequestAsync(request, cancellationToken);
            if (!(entity is TEntity))
                throw new GeneralProcessingException(
                    typeof(ResultCodeApplication),
                    ResultCodeApplication.FailedConvertingToEntity,
                    "The request could not be mapped to an entity"
                );
            else
            {
                var requestName = request.GetType().Name;
                Logger.LogDebug(
                    "Command request mapped: {Name} (request) -> {@EntityName} (entity)",
                    requestName,
                    entity.GetType().Name
                );
                Logger.LogDebug("Entity: {Name} {@entity}", requestName, entity);
            }

            await ValidateAsync(entity, cancellationToken);

            var result = await InnerHandleAsync(entity, request, cancellationToken);

            Logger.LogDebug($"Command complete: {request.GetType().Name}");

            return await MapResponseAsync(result);
        }

        protected abstract ValueTask<IVersionedIndex> InnerHandleAsync(
            TEntity entity,
            TRequest request,
            CancellationToken cancellationToken
        );

        protected virtual ValueTask<TEntity> MapRequestAsync(
            TRequest request,
            CancellationToken cancellationToken
        )
        {
            return ValueTask.FromResult<TEntity>(Mapper.Map<TEntity>(request));
        }

        protected virtual ValueTask<IVersionedIndex> MapResponseAsync(IVersionedIndex entity)
        {
            return ValueTask.FromResult<IVersionedIndex>(
                new VersionedIndex { Id = entity.Id, EventCounter = entity.EventCounter }
            );
        }

        protected virtual ValueTask ValidateAsync(
            TEntity entity,
            CancellationToken cancellationToken
        )
        {
            // entity.ValidateAsync();
            return ValueTask.CompletedTask;
        }
    }
}
