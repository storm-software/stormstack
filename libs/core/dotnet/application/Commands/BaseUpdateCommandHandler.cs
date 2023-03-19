using AutoMapper;
using MediatR;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Repositories;
using OpenSystem.Core.Domain.Common;
using Microsoft.Extensions.Logging;

namespace OpenSystem.Reaction.Application.Commands
{
    public abstract class BaseUpdateCommandHandler<TRequest, TEntity, TRepository>
      : BaseCommandHandler<TRequest, TEntity>
      where TRequest : class, IRequest<CommandResult<IIndexed>>
      where TEntity : AggregateRoot
      where TRepository : IBaseRepository<TEntity>
    {
        protected TRepository Repository { get; init; }

        public BaseUpdateCommandHandler(TRepository repository,
          IMapper mapper,
          ILogger<BaseUpdateCommandHandler<TRequest, TEntity, TRepository>> logger)
          : base(mapper,
              logger)
        {
          Repository = repository;
        }

        protected async override sealed ValueTask<CommandResult<IIndexed>> InnerHandleAsync(TEntity entity,
          TRequest request,
          CancellationToken cancellationToken)
        {
            CommandResult ret = await HandleUpdateAsync(entity,
              request,
              cancellationToken);
            if (ret.Failed)
            return ret;

            entity = await SaveChangesAsync(ret.Data as TEntity,
              cancellationToken);

            return MapResponse(entity);
        }

        protected async virtual Task<CommandResult<TEntity>> HandleUpdateAsync(TEntity entity,
          TRequest request,
          CancellationToken cancellationToken)
        {
          return CommandResult.Success(entity);
        }

        protected async virtual ValueTask<TEntity> SaveChangesAsync(TEntity entity,
          CancellationToken cancellationToken)
        {
          await Repository.UnitOfWork.SaveChangesAsync(cancellationToken);
          return entity;
        }

        protected async override ValueTask<TEntity> MapRequestAsync(TRequest request,
          CancellationToken cancellationToken)
        {
          request = PreMapRequest(request);

          TEntity entity = await Repository.AddOrUpdateAsync<TRequest>(request,
              cancellationToken);
          if (!string.IsNullOrWhiteSpace(entity?.GetType()?.Name))
            Logger.LogDebug($"Command request mapped - {request.GetType().Name} (request) -> {entity.GetType().Name} (entity)");

          return PostMapRequest(request,
            entity);
        }
    }
}
