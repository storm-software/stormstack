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
using OpenSystem.Reaction.Application.Models.DTOs;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Extensions;
using Serilog;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Application.Interfaces;

namespace OpenSystem.Reaction.Application.Commands
{
    public class AddReactionCommandHandler
      : BaseCommandHandler<AddReactionCommand, CommandSuccessResponse, ReactionEntity>
    {
        private readonly IReactionRepository _repository;

        private readonly ICurrentUserService _currentUserService;

        public AddReactionCommandHandler(IReactionRepository repository,
          ICurrentUserService currentUserService,
          IMapper mapper,
          ILogger logger)
          : base (mapper,
            logger)
        {
            _repository = repository;
            _currentUserService = currentUserService;
        }

        protected async override Task<Result<CommandSuccessResponse>> InnerHandleAsync(ReactionEntity entity,
          CancellationToken cancellationToken)
        {
            var existing = await _repository.GetByContentIdAsync(entity.ContentId);
            if (existing != null)
            {
              existing.CopyTo(entity);
              entity.Details.Concat(existing.Details);

              var detail = entity.Details.FirstOrDefault(r => r.UserId == _currentUserService.UserId);
              if (detail != null)
              {
                detail.VerificationCode = VerificationCodeTypes.Verified;
                detail.UserId = _currentUserService.UserId;
              }
            }

            var result = await _repository.AddOrUpdateAsync(entity,
              cancellationToken);

            return Result.Success(new CommandSuccessResponse { Id = result.Id });
        }
    }
}
