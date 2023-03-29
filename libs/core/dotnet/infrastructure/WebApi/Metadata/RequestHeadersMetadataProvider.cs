using System.Reflection;
using Microsoft.AspNetCore.Http;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Infrastructure.WebApi.Metadata
{
    public class RequestHeadersMetadataProvider : IMetadataProvider
    {
        private static readonly ISet<string> RequestHeadersToSkip = new HashSet<string>
        {
            "Authorization",
            "Cookie"
        };

        private readonly IHttpContextAccessor _httpContextAccessor;

        public RequestHeadersMetadataProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public IEnumerable<KeyValuePair<string, string>> ProvideMetadata<TAggregate, TIdentity>(
            TIdentity id,
            IAggregateEvent aggregateEvent,
            IMetadata metadata
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
        {
            return _httpContextAccessor.HttpContext?.Request.Headers
                    .Where(kv => !RequestHeadersToSkip.Contains(kv.Key))
                    .Select(
                        kv =>
                            new KeyValuePair<string, string>(
                                $"request_header[{kv.Key}]",
                                string.Join(Environment.NewLine, kv.Value)
                            )
                    ) ?? Enumerable.Empty<KeyValuePair<string, string>>();
        }
    }
}
