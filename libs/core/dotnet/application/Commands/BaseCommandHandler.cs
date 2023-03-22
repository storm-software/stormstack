using AutoMapper;
using MediatR;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Common;
using Microsoft.Extensions.Logging;

namespace OpenSystem.Reaction.Application.Commands
{
    public abstract class BaseCommandHandler<TRequest, TEntity>
      : IRequestHandler<TRequest, Result<IIndexed>>
      where TRequest : IRequest<Result<IIndexed>>
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

        public async Task<Result<IIndexed>> Handle(TRequest request,
          CancellationToken cancellationToken)
        {
          Logger.LogDebug($"Command processing - {request.GetType().Name}");

          TEntity entity = await MapRequestAsync(request,
            cancellationToken);
          if (!(entity is TEntity))
            return Result.Failure(typeof(ResultCodeApplication),
              ResultCodeApplication.FailedConvertingToEntity);

          Result ret = await ValidateEntityAsync(entity,
            cancellationToken);
          if (ret.Failed)
            return ret;

          var result = await InnerHandleAsync(entity,
            request,
            cancellationToken);

          Logger.LogDebug($"Command complete - {request.GetType().Name}");

          return await MapResponseAsync(result);
        }

        protected abstract ValueTask<IIndexed> InnerHandleAsync(TEntity entity,
          TRequest request,
          CancellationToken cancellationToken);

        protected async virtual ValueTask<TEntity> MapRequestAsync(TRequest request,
          CancellationToken cancellationToken)
        {
          TEntity entity = Mapper.Map<TEntity>(request);
          if (string.IsNullOrWhiteSpace(entity.GetType()?.Name))
            Logger.LogDebug($"Command request mapped - {request.GetType().Name} (request) -> {entity.GetType().Name} (entity)");

          return entity;
        }

        protected virtual ValueTask<Result<IIndexed>> MapResponseAsync(IIndexed entity)
        {
          return  ValueTask.FromResult<Result<IIndexed>>(Result.Success(new Indexed
            {
              Id = entity.Id
            }));
        }

        protected virtual async ValueTask<Result<TEntity>> ValidateEntityAsync(TEntity entity,
          CancellationToken cancellationToken)
        {
          // entity.ValidateAsync();
          return Result.Success(entity);
        }
    }
}
