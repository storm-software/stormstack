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
    private readonly IReactionRepository _repository;

    private readonly IMapper _mapper;

    private readonly ILogger<RemoveReactionCommandHandler> _logger;

    private readonly ICurrentUserService _currentUserService;

    private readonly IDateTimeProvider _dateTimeProvider;

    public RemoveReactionCommandHandler(IReactionRepository repository,
      IMapper mapper,
      ILogger<RemoveReactionCommandHandler> logger,
      ICurrentUserService currentUserService,
      IDateTimeProvider dateTimeProvider)
        : base (repository,
              mapper,
              logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
        _currentUserService = currentUserService;
        _dateTimeProvider = dateTimeProvider;
    }

    protected async override Task<ReactionEntity> HandleCommandAsync(ReactionEntity entity,
      RemoveReactionCommand request,
      CancellationToken cancellationToken)
    {
      var detail = entity.Details.FirstOrDefault(r => r.UserId == _currentUserService.UserId);
      if (detail == null)
        throw new FailedResultException(typeof(ResultCodeApplication),
          ResultCodeApplication.RecordNotFound);

      await entity.SetForDeleteAsync(_currentUserService.UserId,
        _dateTimeProvider.OffsetUtcNow);

      return entity;
    }
  }
}
