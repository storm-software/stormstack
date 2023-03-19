using AutoMapper;
using MediatR;
using OpenSystem.Reaction.Application.Interfaces;
using OpenSystem.Core.Application.Models.Parameters;
using OpenSystem.Core.Application.Models;
using OpenSystem.Reaction.Domain.Repositories;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Application.Models.DTOs;
using Serilog;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Reaction.Domain.Entities;

namespace OpenSystem.Reaction.Application.Queries
{
    public class GetReactionsQueryHandler
      : IRequestHandler<GetReactionsQuery, GetReactions200Response>
    {
        private readonly IReactionRepository _repository;

        private readonly IMapper _mapper;

        private readonly ILogger _logger;

        public GetReactionsQueryHandler(IReactionRepository repository,
          IMapper mapper,
          ILogger logger)
        {
            _repository = repository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<GetReactions200Response> Handle(GetReactionsQuery request,
          CancellationToken cancellationToken)
        {
            PagedResult<ReactionEntity> ret = await _repository.GetReactionsAsync(request.ContentId,
              request.Type,
              request.PageSize,
              request.PageNumber);
            if (ret.Failed)
              throw new GeneralProcessingException();
            if (!(ret.Data is List<ReactionCountRecord> result))
              throw new GeneralProcessingException();
            var data = _mapper.Map<List<ReactionDetailRecord>>(result);

            return new GetReactions200Response {
              Data = data,
              PageNumber = request.PageNumber,
              PageSize = request.PageSize,
              RecordsTotal = ret.RecordsTotal,
              RecordsFiltered = ret.RecordsFiltered
            };
        }
    }
}
