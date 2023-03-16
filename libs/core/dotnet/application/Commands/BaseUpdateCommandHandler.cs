using AutoMapper;
using MediatR;
using Serilog;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Application.Models.DTOs;
using OpenSystem.Core.Application.Repositories;
using OpenSystem.Core.Application.Services;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Exceptions;

namespace OpenSystem.Reaction.Application.Commands
{
    public abstract class BaseUpdateCommandHandler<TRequest, TEntity, TRepository>
      : BaseCommandHandler<TRequest, TEntity>
      where TRequest : class, IRequest<Result<CommandSuccessResponse>>
      where TEntity : AggregateRoot
      where TRepository : IBaseRepository<TEntity>
    {
        protected TRepository Repository { get; init; }

        protected ICurrentUserService CurrentUserService { get; init; }

        protected IDateTimeProvider DateTimeProvider { get; init; }


        public BaseUpdateCommandHandler(TRepository repository,
          IMapper mapper,
          ILogger logger,
          ICurrentUserService currentUserService,
          IDateTimeProvider dateTimeProvider)
          : base(mapper,
              logger)
        {
          Repository = repository;
          CurrentUserService = currentUserService;
          DateTimeProvider = dateTimeProvider;
        }

        protected async override sealed Task<Result<CommandSuccessResponse>> InnerHandleAsync(TEntity entity,
          CancellationToken cancellationToken)
        {
            /*if (entity.Status > EntityStatusTypes.Active)
              throw new FailedResultException(typeof(ResultCodeValidation),
                ResultCodeValidation.EntityIsNotActive);*/

            if (entity.EventCounter == 0)
            {
              entity.CreatedBy = CurrentUserService.UserId;
              entity.CreatedDateTime = DateTimeProvider.OffsetUtcNow;
              entity.EventCounter = 1;
              entity.EventType = EntityEventTypes.Create;
            }
            else
            {
              entity.UpdatedBy = CurrentUserService.UserId;
              entity.UpdatedDateTime = DateTimeProvider.OffsetUtcNow;
              entity.EventCounter++;
              entity.EventType = EntityEventTypes.Update;
            }

            Result ret = await HandleUpdateAsync(entity,
              cancellationToken);
            if (ret.Failed)
            return ret;

            //var savedEntity = ret.Data as TEntity;
            ret = await SaveChangesAsync(entity,
              cancellationToken);
            if (ret.Failed)
            return ret;

            return MapResponseAsync(entity,
              cancellationToken);
        }

        protected async virtual Task<Result<TEntity>> HandleUpdateAsync(TEntity entity,
          CancellationToken cancellationToken)
        {
            return Result.Success(entity);
        }

        protected async virtual Task<Result> SaveChangesAsync(TEntity entity,
          CancellationToken cancellationToken)
        {
          await Repository.UnitOfWork.SaveChangesAsync(cancellationToken);
          return Result.Success();
        }

        protected virtual Result<CommandSuccessResponse> MapResponseAsync(TEntity entity,
          CancellationToken cancellationToken)
        {
            return Result.Success(new CommandSuccessResponse { Id = entity.Id });
        }

        protected async override Task<Result<TEntity>> MapRequestAsync(TRequest request,
          CancellationToken cancellationToken)
        {
          Result ret = await PreMapRequestAsync(request,
            cancellationToken);
          if (ret.Failed)
            return ret;

          TEntity entity = await Repository.FirstOrDefaultAsync<TRequest>(request,
            cancellationToken);
          if (string.IsNullOrWhiteSpace(entity.GetType()?.Name))
            Logger.Debug($"Command request mapped - {request.GetType().Name} (request) -> {entity.GetType().Name} (entity)");

          return await PostMapRequestAsync(request,
            entity,
            cancellationToken);
        }
    }
}
