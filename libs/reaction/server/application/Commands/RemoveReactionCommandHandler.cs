using AutoMapper;
using MediatR;
//using OpenSystem.Reaction.Domain.Repositories;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Application.Services;
using OpenSystem.Reaction.Domain.Entities;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Application.Commands;
using OpenSystem.Reaction.Domain.Aggregates;
using OpenSystem.Reaction.Domain.ValueObjects;
using OpenSystem.Reaction.Domain.Enums;

namespace OpenSystem.Reaction.Application.Commands
{
    public class RemoveReactionCommandHandler
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
                aggregate.RemoveReaction(
                    (ReactionTypes)
                        Enum.Parse(typeof(ReactionTypes), request.Payload.Type.ToString(), true)
                )
            );
        }
    }
}
