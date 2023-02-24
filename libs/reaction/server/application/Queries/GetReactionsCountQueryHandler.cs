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
            var result = await _repository.GetReactionsCountAsync(request);
            _logger.Information(result.Count().ToString());
            var data = _mapper.Map<List<ReactionCountRecord>>(result);

            return new GetReactionsCount200Response {
              Data = data,
            };
        }
    }
}
