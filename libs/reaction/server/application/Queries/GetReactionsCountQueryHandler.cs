using AutoMapper;
using OpenSystem.Reaction.Domain.Repositories;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Application.Models.DTOs;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ResultCodes;
using Microsoft.Extensions.Logging;

namespace OpenSystem.Reaction.Application.Queries
{
  public class GetReactionsCountQueryHandler
    : BaseQueryHandler<GetReactionsCountQuery, GetReactionsCount200Response>
  {
    private readonly IReactionRepository _repository;

    public GetReactionsCountQueryHandler(IReactionRepository repository,
      IMapper mapper,
      ILogger<GetReactionsCountQueryHandler> logger)
      : base (mapper,
          logger)
    {
      _repository = repository;
    }

    protected override async ValueTask<QueryResult> InnerHandleAsync(GetReactionsCountQuery request,
      CancellationToken cancellationToken)
    {
      return await _repository.GetReactionsCountAsync(request.ContentId,
        request.Type);
    }
  }
}
