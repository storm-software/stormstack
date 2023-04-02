using AutoMapper;
using MediatR;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Common;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Domain.Aggregates;

namespace OpenSystem.Core.Application.Commands
{
    public abstract class BaseCommandHandler<TAggregate, TIdentity, TRequest>
        : ICommandHandler<TAggregate, TIdentity, TRequest>
        where TRequest : ICommand<TAggregate, TIdentity>
        where TAggregate : IAggregateRoot<TIdentity>
        where TIdentity : IIdentity
    {
        protected IMapper Mapper { get; set; }

        protected ILogger<BaseCommandHandler<TAggregate, TIdentity, TRequest>> Logger { get; set; }

        public BaseCommandHandler(
            IMapper mapper,
            ILogger<BaseCommandHandler<TAggregate, TIdentity, TRequest>> logger
        )
        {
            Mapper = mapper;
            Logger = logger;
        }

        public async Task<IAggregateEventResult> Handle(
            TRequest request,
            CancellationToken cancellationToken
        )
        {
            Logger.LogDebug($"Command processing: {request.GetType().Name}");

            TAggregate aggregate = request.Aggregate;
            if (!(aggregate is TAggregate))
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
                    aggregate.GetType().Name
                );
                Logger.LogDebug("Entity: {Name} {@entity}", requestName, aggregate);
            }

            await ValidateAsync(aggregate, cancellationToken);

            var result = await InnerHandleAsync(aggregate, request, cancellationToken);

            Logger.LogDebug($"Command complete: {request.GetType().Name}");

            return await MapResponseAsync(result);
        }

        protected abstract ValueTask<IVersionedIndex<IIdentity>> InnerHandleAsync(
            TAggregate entity,
            TRequest request,
            CancellationToken cancellationToken
        );

        protected virtual ValueTask<TAggregate> MapRequestAsync(
            TRequest request,
            CancellationToken cancellationToken
        )
        {
            return ValueTask.FromResult<TAggregate>(Mapper.Map<TAggregate>(request));
        }

        protected virtual ValueTask<IAggregateEventResult> MapResponseAsync(
            IVersionedIndex<IIdentity> entity
        )
        {
            return ValueTask.FromResult<IAggregateEventResult>(
                AggregateEventResult.Success(
                    new VersionedIndex<IIdentity>(entity.Id, entity.Version)
                )
            );
        }

        protected virtual ValueTask ValidateAsync(
            TAggregate entity,
            CancellationToken cancellationToken
        )
        {
            // entity.ValidateAsync();
            return ValueTask.CompletedTask;
        }
    }
}
