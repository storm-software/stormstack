using AutoMapper;
//using OpenSystem.Reaction.Domain.Repositories;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Application.Models.DTOs;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ResultCodes;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Application.Queries;
using MediatR;
using OpenSystem.Core.Domain.ReadStores;
using OpenSystem.Reaction.Domain.ReadStores;

namespace OpenSystem.Reaction.Application.Queries
{
    public class GetReactionsCountQueryHandler
        : IQueryHandler<GetReactionsCountQuery, GetReactionsCount200Response>
    {
        private readonly IReadModelStore<ReactionReadModel> _readStore;

        private readonly IMapper _mapper;

        private readonly ILogger<GetReactionsCountQueryHandler> _logger;

        public GetReactionsCountQueryHandler(
            IReadModelStore<ReactionReadModel> readStore,
            IMapper mapper,
            ILogger<GetReactionsCountQueryHandler> logger
        )
        {
            _readStore = readStore;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<GetReactionsCount200Response> Handle(
            GetReactionsCountQuery query,
            CancellationToken cancellationToken
        )
        {
            var readModelEnvelope = await _readStore
                .GetAsync(query.ReactionId, cancellationToken)
                .ConfigureAwait(false);

            _logger.LogInformation("ReadModel: {0}", readModelEnvelope.ReadModel);

            var result = _mapper.Map<GetReactionsCount200Response>(readModelEnvelope.ReadModel);

            _logger.LogInformation(
                "GetReactionsCount200Response: {0}",
                readModelEnvelope.ReadModel
            );

            return result;
        }
    }
}
