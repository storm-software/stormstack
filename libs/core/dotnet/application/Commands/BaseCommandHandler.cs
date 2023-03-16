using AutoMapper;
using MediatR;
using Serilog;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Application.Models.DTOs;

namespace OpenSystem.Reaction.Application.Commands
{
    public abstract class BaseCommandHandler<TRequest, TEntity>
      : IRequestHandler<TRequest, Result<CommandSuccessResponse>>
      where TRequest : IRequest<Result<CommandSuccessResponse>>
      where TEntity : AggregateRoot
    {
        protected readonly IMapper Mapper;

        protected readonly ILogger Logger;

        public BaseCommandHandler(IMapper mapper,
          ILogger logger)
        {
            Mapper = mapper;
            Logger = logger;
        }

        public async Task<Result<CommandSuccessResponse>> Handle(TRequest request,
          CancellationToken cancellationToken)
        {
          Logger.Debug($"Command processing - {request.GetType().Name}");

          Result ret = await MapRequestAsync(request,
            cancellationToken);
          if (ret.Failed)
            return ret;

          var entity = ret.Data as TEntity;
          if (!(entity is IEntity))
            return Result.Failure(typeof(ResultCodeApplication),
              ResultCodeApplication.FailedConvertingToEntity);

          ret = await ValidateEntityAsync(entity,
            cancellationToken);
          if (ret.Failed)
            return ret;

          ret = await InnerHandleAsync(entity,
            cancellationToken);
          if (ret.Failed)
            return ret;

          Logger.Debug($"Command complete - {request.GetType().Name}");

            return ret;
        }

        protected abstract Task<Result<CommandSuccessResponse>> InnerHandleAsync(TEntity request,
          CancellationToken cancellationToken);

        protected async virtual Task<Result<TRequest>> PreMapRequestAsync(TRequest request,
          CancellationToken cancellationToken)
        {
          return Result<TRequest>.Success(request);
        }

        protected async virtual Task<Result<TEntity>> PostMapRequestAsync(TRequest request,
          TEntity entity,
          CancellationToken cancellationToken)
        {
          return Result<TEntity>.Success(entity);
        }

        protected async virtual Task<Result> InnerValidateEntityAsync(TEntity entity,
          CancellationToken cancellationToken)
        {
          return Result.Success();
        }

        protected async virtual Task<Result<TEntity>> MapRequestAsync(TRequest request,
          CancellationToken cancellationToken)
        {
          Result ret = await PreMapRequestAsync(request,
            cancellationToken);
          if (ret.Failed)
            return ret;

          TEntity entity = Mapper.Map<TEntity>(request);
          if (string.IsNullOrWhiteSpace(entity.GetType()?.Name))
            Logger.Debug($"Command request mapped - {request.GetType().Name} (request) -> {entity.GetType().Name} (entity)");

          return await PostMapRequestAsync(request,
            entity,
            cancellationToken);
        }

        private async Task<Result> ValidateEntityAsync(TEntity entity,
          CancellationToken cancellationToken)
        {
          Logger.Debug($"Command validation (Start) - {entity.GetType().Name}");

          // Result ret = entity.Validate()

          Result ret = await InnerValidateEntityAsync(entity,
            cancellationToken);
          if (ret.Failed)
            return ret;

          Logger.Debug($"Command validation (Success) - {entity.GetType().Name}");

          return ret;
        }
    }
}
