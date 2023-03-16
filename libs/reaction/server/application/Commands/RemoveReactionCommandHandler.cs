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
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Domain.Extensions;
using Serilog;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Application.Services;

namespace OpenSystem.Reaction.Application.Commands
{
  public class RemoveReactionCommandHandler
    : IRequestHandler<RemoveReactionCommand, Result<CommandSuccessResponse>>
  {
    private readonly IReactionRepository _repository;

    private readonly IMapper _mapper;

    private readonly ILogger _logger;

    private readonly ICurrentUserService _currentUserService;

    private readonly IDateTimeProvider _dateTimeProvider;

    public RemoveReactionCommandHandler(IReactionRepository repository,
      IMapper mapper,
      ILogger logger,
      ICurrentUserService currentUserService,
      IDateTimeProvider dateTimeProvider)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
        _currentUserService = currentUserService;
        _dateTimeProvider = dateTimeProvider;
    }

    public async Task<Result<CommandSuccessResponse>> Handle(RemoveReactionCommand request,
      CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByContentIdAsync(request.ContentId);
        entity.ContentId = request.ContentId;

        var detail = entity.Details.FirstOrDefault(d => d.UserId == _currentUserService.UserId);
        detail.UserId = _currentUserService.UserId;

        var result = await _repository.AddOrUpdateAsync(entity,
          cancellationToken);

        return Result.Success(new CommandSuccessResponse { Id = result.Id });
    }
  }
}
