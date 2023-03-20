using AutoMapper;
using OpenSystem.Reaction.Domain.Repositories;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Application.Models.DTOs;
using OpenSystem.Core.Domain.ResultCodes;
using Microsoft.Extensions.Logging;

namespace OpenSystem.Reaction.Application.Queries
{
  public class GetReactionsQueryHandler
    : BaseListQueryHandler<GetReactionsQuery, GetReactions200Response>
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

    protected override async Task<ListQueryResult> HandleQueryAsync(GetReactionsQuery request,
      CancellationToken cancellationToken)
    {
      return await _repository.GetReactionsAsync(request.ContentId,
        request.Type,
        request.PageSize,
        request.PageNumber);
    }
  }
}
