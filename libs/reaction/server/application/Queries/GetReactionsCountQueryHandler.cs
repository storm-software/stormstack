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

namespace OpenSystem.Reaction.Application.Queries
{
    public class GetReactionsCountQueryHandler
      : IRequestHandler<GetReactionsCountQuery, GetReactionsCount200Response>
    {
        private readonly IReactionRepository _repository;

        private readonly IMapper _mapper;

        private readonly ILogger _logger;

        public GetReactionsCountQueryHandler(IReactionRepository repository,
          IMapper mapper,
          ILogger logger)
        {
            _repository = repository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<GetReactionsCount200Response> Handle(GetReactionsCountQuery request,
          CancellationToken cancellationToken)
        {
            // query based on filter
            PagedResult<(string Type, int Count)> ret = await _repository.GetReactionsCountAsync(request.ContentId,
              request.Type);
            if (ret.Failed)
              throw new GeneralProcessingException();
            if (!(ret.Data is List<(string Type, int Count)> result))
              throw new GeneralProcessingException();

            _logger.Information(result.Count().ToString());
            var data = _mapper.Map<List<ReactionCountRecord>>(result);

            _logger.Information(result.Count().ToString());
            _logger.Information(result.Count() > 0 ? result.First().Count.ToString() : "0");

            return new GetReactionsCount200Response {
              Data = data,
            };
        }
    }
}
