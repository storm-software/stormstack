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
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Application.Services;
using OpenSystem.Reaction.Domain.Repositories;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Exceptions;

namespace OpenSystem.Reaction.Application.Commands
{
    public class AddReactionCommandHandler
        : BaseUpdateCommandHandler<AddReactionCommand, ReactionEntity, IReactionRepository>
    {
        private readonly ICurrentUserService _currentUserService;

        public AddReactionCommandHandler(
            IReactionRepository repository,
            IMapper mapper,
            ILogger<AddReactionCommandHandler> logger,
            ICurrentUserService currentUserService,
            IDateTimeProvider dateTimeProvider
        )
            : base(repository, mapper, logger)
        {
            _currentUserService = currentUserService;
        }

        protected async override Task<ReactionEntity> HandleCommandAsync(
            ReactionEntity entity,
            AddReactionCommand request,
            CancellationToken cancellationToken
        )
        {
            if (!entity.Details.Any(r => r.UserId == _currentUserService.UserId))
            {
                ReactionDetailEntity detail;
                if (entity.Details.Any(r => string.IsNullOrEmpty(r.UserId)))
                {
                    detail = entity.Details.Find(r => string.IsNullOrEmpty(r.UserId));
                    detail.UserId = _currentUserService.UserId;
                }
                else
                {
                    detail = await Repository.AddOrUpdateDetailAsync(
                        entity.Id,
                        _currentUserService.UserId,
                        cancellationToken,
                        true
                    );

                    if (detail.IsDeleted)
                        detail = await Repository.RestoreDetailAsync(detail, cancellationToken);
                }
            }

            return entity;
        }
    }
}
