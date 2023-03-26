using AutoMapper;
using MediatR;
using OpenSystem.Reaction.Domain.Repositories;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Application.Services;
using OpenSystem.Reaction.Domain.Entities;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Exceptions;

namespace OpenSystem.Reaction.Application.Commands
{
    public class RemoveReactionCommandHandler
        : BaseUpdateCommandHandler<RemoveReactionCommand, ReactionEntity, IReactionRepository>
    {
        protected ICurrentUserService _currentUserService { get; set; }

        public RemoveReactionCommandHandler(
            IReactionRepository repository,
            IMapper mapper,
            ILogger<RemoveReactionCommandHandler> logger,
            ICurrentUserService currentUserService,
            IDateTimeProvider dateTimeProvider
        )
            : base(repository, mapper, logger)
        {
            _currentUserService = currentUserService;
        }

        protected async override Task<ReactionEntity> HandleCommandAsync(
            ReactionEntity entity,
            RemoveReactionCommand request,
            CancellationToken cancellationToken
        )
        {
            if (!entity.Details.Any(r => r.UserId == _currentUserService.UserId))
                throw new NotFoundException();

            var detail = await Repository.DeleteDetailAsync(
                entity.Details.First(r => r.UserId == _currentUserService.UserId),
                cancellationToken
            );
            if (!(detail is ReactionDetailEntity))
                throw new GeneralProcessingException(
                    typeof(ResultCodeApplication),
                    ResultCodeApplication.FailedConvertingToEntity
                );

            return entity;
        }
    }
}
