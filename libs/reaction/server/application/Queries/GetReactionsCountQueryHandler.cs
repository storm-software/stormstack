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

namespace OpenSystem.Reaction.Application.Queries
{
    public class GetReactionsCountQueryHandler<TReadStore, TReadModel>
        : IQueryHandler<GetReactionsCountQuery, GetReactionsCount200Response>
        where TReadStore : IReadModelStore<TReadModel>
        where TReadModel : GetReactionsCount200Response, IReadModel
    {
        private readonly TReadStore _readStore;

        private readonly IMapper _mapper;

        private readonly ILogger<GetReactionsCountQueryHandler<TReadStore, TReadModel>> _logger;

        public GetReactionsCountQueryHandler(
            TReadStore readStore,
            IMapper mapper,
            ILogger<GetReactionsCountQueryHandler<TReadStore, TReadModel>> logger
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
