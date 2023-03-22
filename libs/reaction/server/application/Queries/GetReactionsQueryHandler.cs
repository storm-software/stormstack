using AutoMapper;
using OpenSystem.Reaction.Domain.Repositories;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Application.Models.DTOs;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Reaction.Application.Queries
{
  public class GetReactionsQueryHandler
    : BaseListQueryHandler<GetReactionsQuery, ReactionDetailRecord>
  {
    private readonly IReactionRepository _repository;

    public GetReactionsQueryHandler(IReactionRepository repository,
      IMapper mapper,
      ILogger<GetReactionsQueryHandler> logger)
      : base (mapper,
          logger)
    {
      _repository = repository;
    }

    protected override async Task<Paged<object>> HandleQueryAsync(GetReactionsQuery request,
      CancellationToken cancellationToken)
    {
      return await _repository.GetReactionsAsync(request.ContentId,
        request.Type,
        request.PageSize,
        request.PageNumber);
    }
  }
}
