using AutoMapper;
using MediatR;
using OpenSystem.Core.Application.Models;
using OpenSystem.Reaction.Domain.Entities;
using OpenSystem.Reaction.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Domain.ValueObjects;
using OpenSystem.Core.Application.Services;
using OpenSystem.Reaction.Domain.Aggregates;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Application.Commands;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Reaction.Application.Commands
{
    public class AddReactionCommandHandler
        : ICommandHandler<ReactionAggregate, ReactionId, AddReactionCommand>
    {
        /*private readonly ICurrentUserService _currentUserService;

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
        }*/


        public Task<IAggregateEventResult> Handle(
            AddReactionCommand request,
            CancellationToken cancellationToken
        )
        {
            var aggregate = request.Aggregate;
            return Task.FromResult(
                aggregate.AddReaction(
                    (ReactionTypes)
                        Enum.Parse(typeof(ReactionTypes), request.Payload.Type.ToString(), true)
                )
            );
        }
    }
}
