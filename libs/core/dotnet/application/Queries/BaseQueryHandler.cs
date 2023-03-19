using AutoMapper;
using MediatR;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Repositories;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Entities;

namespace OpenSystem.Reaction.Application.Queries
{
    public abstract class BaseQueryHandler<TRequest, TResponse>
      : IRequestHandler<TRequest, Result<TResponse>>
      where TRequest : IRequest<Result<TResponse>>
    {
        private readonly IMapper Mapper;

        private readonly ILogger<BaseQueryHandler<TRequest, TResponse>> Logger;

        public BaseQueryHandler(IMapper mapper,
          ILogger<BaseQueryHandler<TRequest, TResponse>> logger)
        {
            Mapper = mapper;
            Logger = logger;
        }

        public async Task<Result<TResponse>> Handle(TRequest request,
          CancellationToken cancellationToken)
        {
            // query based on filter
            /*PagedResult<(string Type, int Count)> ret = await _repository.GetReactionsCountAsync(request.ContentId,
              request.Type);
            if (ret.Failed)
              throw new GeneralProcessingException();
            if (!(ret.Data is List<(string Type, int Count)> result))
              throw new GeneralProcessingException();
            if (!(ret.Data is List<(string Type, int Count)> result))
              throw new GeneralProcessingException();

            _logger.Information(result.Count().ToString());
            var data = _mapper.Map<List<ReactionCountRecord>>(result);

            _logger.Information(result.Count().ToString());
            _logger.Information(result.Count() > 0 ? result.First().Count.ToString() : "0");

            return new GetReactionsCount200Response {
              Data = data,
            };*/

            Logger.LogDebug($"Command processing - {request.GetType().Name}");

          /*Result ret = await MapRequestAsync(request,
            cancellationToken);
          if (ret.Failed)
            return ret;

          Result ret = await InnerHandleAsync(request,
            cancellationToken);
          if (ret.Failed)
            return ret;

          Logger.LogDebug($"Command complete - {request.GetType().Name}");
*/
            return Result.Success();
        }

        protected abstract ValueTask<Result<TResponse>> InnerHandleAsync(TRequest request,
          CancellationToken cancellationToken);

        protected async virtual ValueTask<Result> MapResponseAsync(object queryResult)
        {
          return Result.Success();
        }

        /*protected async override sealed ValueTask<PagedResult<CommandSuccessResponse>> InnerHandleAsync(TEntity entity,
          TRequest request,
          CancellationToken cancellationToken)
        {
            Result ret = await HandleUpdateAsync(entity,
              request,
              cancellationToken);
            if (ret.Failed)
            return ret;

            //var savedEntity = ret.Data as TEntity;
            ret = await SaveChangesAsync(entity,
              cancellationToken);
            if (ret.Failed)
            return ret;

            return MapResponse(entity);
        }*/
  }
}
