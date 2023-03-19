using AutoMapper;
using MediatR;
using Serilog;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Common;
using Microsoft.Extensions.Logging;

namespace OpenSystem.Reaction.Application.Commands
{
    public abstract class BaseCommandHandler<TRequest, TEntity>
      : IRequestHandler<TRequest, CommandResult<IIndexed>>
      where TRequest : IRequest<CommandResult<IIndexed>>
      where TEntity : AggregateRoot
    {
        protected readonly IMapper Mapper;

        protected readonly ILogger<BaseCommandHandler<TRequest, TEntity>> Logger;

        public BaseCommandHandler(IMapper mapper,
          ILogger<BaseCommandHandler<TRequest, TEntity>> logger)
        {
            Mapper = mapper;
            Logger = logger;
        }

        public async Task<CommandResult<IIndexed>> Handle(TRequest request,
          CancellationToken cancellationToken)
        {
          Logger.LogDebug($"Command processing - {request.GetType().Name}");

          TEntity entity = await MapRequestAsync(request,
            cancellationToken);
          if (!(entity is TEntity))
            return CommandResult.Failure(typeof(ResultCodeApplication),
              ResultCodeApplication.FailedConvertingToEntity);

          CommandResult ret = await ValidateEntityAsync(entity,
            cancellationToken);
          if (ret.Failed)
            return ret;

          ret = await InnerHandleAsync(entity,
            request,
            cancellationToken);
          if (ret.Failed)
            return ret;

          Logger.LogDebug($"Command complete - {request.GetType().Name}");

          return MapResponse(entity);
        }

        protected abstract ValueTask<CommandResult<IIndexed>> InnerHandleAsync(TEntity entity,
          TRequest request,
          CancellationToken cancellationToken);

        protected virtual TRequest PreMapRequest(TRequest request)
        {
          return request;
        }

        protected virtual TEntity PostMapRequest(TRequest request,
          TEntity entity)
        {
          return entity;
        }

        protected async virtual ValueTask<TEntity> MapRequestAsync(TRequest request,
          CancellationToken cancellationToken)
        {
          request = PreMapRequest(request);

          TEntity entity = Mapper.Map<TEntity>(request);
          if (string.IsNullOrWhiteSpace(entity.GetType()?.Name))
            Logger.LogDebug($"Command request mapped - {request.GetType().Name} (request) -> {entity.GetType().Name} (entity)");

          return PostMapRequest(request,
            entity);
        }

        protected virtual CommandResult<IIndexed> MapResponse(TEntity entity)
        {
          return CommandResult.Success(new Indexed 
            { 
              Id = entity.Id 
            });
        }

        protected async virtual ValueTask<CommandResult<TEntity>> InnerValidateEntityAsync(TEntity entity,
          CancellationToken cancellationToken)
        {
          return CommandResult.Success(entity);
        }

        private async ValueTask<CommandResult<TEntity>> ValidateEntityAsync(TEntity entity,
          CancellationToken cancellationToken)
        {
          Logger.LogDebug($"Command validation (Start) - {entity.GetType().Name}");

          // Result ret = entity.Validate()

          CommandResult ret = await InnerValidateEntityAsync(entity,
            cancellationToken);
          if (ret.Failed)
            return ret;

          Logger.LogDebug($"Command validation (Success) - {entity.GetType().Name}");

          return ret;
        }
    }
}
