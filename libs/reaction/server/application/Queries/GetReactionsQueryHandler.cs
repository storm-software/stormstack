using AutoMapper;
using MediatR;
using OpenSystem.Reaction.Application.Interfaces;
using OpenSystem.Core.Application.Models.Parameters;
using OpenSystem.Core.Application.Models;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Application.Models.DTOs;
using Serilog;

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
            // query based on filter
            var result = await _repository.GetReactionsAsync(request);
            var data = _mapper.Map<List<ReactionDetailRecord>>(result.Data);

            return new GetReactions200Response {
              Data = data,
              PageNumber = request.PageNumber,
              PageSize = request.PageSize,
              RecordsTotal = result.RecordsCount.RecordsTotal,
              RecordsFiltered = result.RecordsCount.RecordsFiltered
            };
        }
    }
}
