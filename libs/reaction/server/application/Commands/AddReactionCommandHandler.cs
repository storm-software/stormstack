using AutoMapper;
using MediatR;
using OpenSystem.Core.Application.Models;
using OpenSystem.Reaction.Application.Interfaces;
using OpenSystem.Reaction.Domain.Entities;
using OpenSystem.Reaction.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Extensions;
using Serilog;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Application.Services;

namespace OpenSystem.Reaction.Application.Commands
{
    public class AddReactionCommandHandler
      : BaseUpdateCommandHandler<AddReactionCommand, ReactionEntity, IReactionRepository>
    {
        private readonly IReactionRepository _repository;

        public AddReactionCommandHandler(IReactionRepository repository,
          IMapper mapper,
          ILogger logger,
          ICurrentUserService currentUserService,
          IDateTimeProvider dateTimeProvider)
            : base (repository,
              mapper,
              logger,
              currentUserService,
              dateTimeProvider)
        {
            _repository = repository;
        }

        protected async override Task<Result<ReactionEntity>> HandleUpdateAsync(ReactionEntity entity,
          CancellationToken cancellationToken)
        {
            /*var existing = await _repository.GetByContentIdAsync(entity.ContentId);
            if (existing != null)
            {
              existing.CopyTo(entity);
              entity.Details.Concat(existing.Details);

              var detail = entity.Details.FirstOrDefault(r => r.UserId == CurrentUserService.UserId);
              if (detail != null)
              {
                detail.Status = EntityStatusTypes.Active;
                detail.UserId = CurrentUserService.UserId;
              }
            }

            var result = await _repository.AddOrUpdateAsync(entity,
              cancellationToken);*/

            var detail = entity.Details.FirstOrDefault(r => r.UserId == CurrentUserService.UserId);
              if (detail != null)
              {
                detail.Status = EntityStatusTypes.Active;
                detail.UserId = CurrentUserService.UserId;
              }

            return Result.Success(entity);
        }
    }
}
