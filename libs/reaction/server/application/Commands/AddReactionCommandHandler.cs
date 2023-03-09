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

namespace OpenSystem.Reaction.Application.Commands
{
    public class AddReactionCommandHandler
      : BaseCommandHandler<AddReactionCommand, CommandSuccessResponse, ReactionEntity>
    {
        private readonly IReactionRepository _repository;

        public AddReactionCommandHandler(IReactionRepository repository,
          IMapper mapper,
          ILogger logger)
          : base (mapper,
            logger)
        {
            _repository = repository;
        }

        protected async override Task<Result<CommandSuccessResponse>> InnerHandleAsync(ReactionEntity entity,
          CancellationToken cancellationToken)
        {
            var existing = await _repository.GetByContentIdAsync(entity.ContentId);
            if (existing != null) {
              existing.CopyTo(entity);
              entity.Details.Concat(existing.Details);

              if (existing.IsDisabled)
                foreach (ReactionDetailEntity rde in entity.Details)
                  rde.VerificationCode = VerificationCodeTypes.Unverified;
            }

            Logger.Information(entity.Details.Count().ToString());

            var result = await _repository.AddOrUpdateAsync(entity,
              cancellationToken);

            return Result.Success(new CommandSuccessResponse { Id = result.Id });
        }
    }
}
