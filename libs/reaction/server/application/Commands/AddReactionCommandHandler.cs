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

        private readonly IDateTimeProvider _dateTimeProvider;

        public AddReactionCommandHandler(IReactionRepository repository,
          IMapper mapper,
          ILogger<AddReactionCommandHandler> logger,
          ICurrentUserService currentUserService,
          IDateTimeProvider dateTimeProvider)
            : base (repository,
              mapper,
              logger)
        {
            _currentUserService = currentUserService;
            _dateTimeProvider = dateTimeProvider;
        }

        protected async override Task<ReactionEntity> HandleCommandAsync(ReactionEntity entity,
          AddReactionCommand request,
          CancellationToken cancellationToken)
        {
            var detail = entity.Details.First(r => r.UserId == _currentUserService.UserId);
            if (detail == null)
            {
              detail = await entity.AddDetailAsync(_currentUserService.UserId,
                (ReactionTypes)Enum.Parse(typeof(ReactionTypes),
                  request.Type.ToString()),
                _dateTimeProvider.OffsetUtcNow);
              if (!(detail is ReactionDetailEntity))
                throw new FailedResultException(typeof(ResultCodeApplication),
                  ResultCodeApplication.FailedConvertingToEntity);

              detail.UserId = _currentUserService.UserId;
            }

            return entity;
        }
    }
}
