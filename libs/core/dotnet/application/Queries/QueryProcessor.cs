using System.Reflection;
using MediatR;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Application.Models;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ReadStores;

namespace OpenSystem.Core.Application.Queries
{
    public class QueryProcessor : IQueryProcessor
    {
        /*private class CacheItem
        {
            public Type QueryHandlerType { get; set; }

            public Func<IQueryHandler, IQuery, CancellationToken, Task> HandlerFunc { get; set; }
        }*/

        private readonly ILogger<QueryProcessor> _logger;

        private readonly IServiceProvider _serviceProvider;

        private readonly IMemoryCache _memoryCache;

        private readonly ISender _sender;

        public QueryProcessor(
            ILogger<QueryProcessor> logger,
            IServiceProvider serviceProvider,
            IMemoryCache memoryCache,
            ISender sender
        )
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
            _memoryCache = memoryCache;
            _sender = sender;
        }

        public async Task<object?> ProcessAsync(object query, CancellationToken cancellationToken)
        {
            /*var queryType = query.GetType();
            var cacheItem = GetCacheItem(queryType);

            var queryHandler = (IQueryHandler)
                _serviceProvider.GetRequiredService(cacheItem.QueryHandlerType);
            if (_logger.IsEnabled(LogLevel.Trace))
            {
                _logger.LogTrace(
                    "Executing query {QueryType} ({QueryHandlerType}) by using query handler {QueryHandlerType}",
                    queryType.PrettyPrint(),
                    cacheItem.QueryHandlerType.PrettyPrint(),
                    queryHandler.GetType().PrettyPrint()
                );
            }

            var task = (Task<TResult>)cacheItem.HandlerFunc(queryHandler, query, cancellationToken);

            return await task.ConfigureAwait(false);*/

            _logger.LogDebug(
                "Processing query {QueryType} \r\nRequest: {Query}",
                query.GetType().PrettyPrint(),
                query
            );

            var result = await _sender.Send(query, cancellationToken);

            _logger.LogDebug(
                "Completed query {QueryType} \r\nResult: {result}",
                query.GetType().PrettyPrint(),
                result
            );

            return result;
        }

        /*private CacheItem GetCacheItem(Type queryType)
        {
            return _memoryCache.GetOrCreate(
                CacheKey.With(GetType(), queryType.GetCacheKey()),
                e =>
                {
                    e.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1);
                    var queryInterfaceType = queryType
                        .GetTypeInfo()
                        .GetInterfaces()
                        .Single(
                            i =>
                                i.GetTypeInfo().IsGenericType
                                && i.GetGenericTypeDefinition() == typeof(IQuery<>)
                        );
                    var queryHandlerType = typeof(IQueryHandler<,>).MakeGenericType(
                        queryType,
                        queryInterfaceType.GetTypeInfo().GetGenericArguments()[0]
                    );
                    var invokeExecuteQueryAsync = ReflectionHelper.CompileMethodInvocation<
                        Func<IQueryHandler, IQuery, CancellationToken, Task>
                    >(queryHandlerType, "ExecuteQueryAsync", queryType, typeof(CancellationToken));
                    return new CacheItem
                    {
                        QueryHandlerType = queryHandlerType,
                        HandlerFunc = invokeExecuteQueryAsync
                    };
                }
            );
        }*/
    }
}
