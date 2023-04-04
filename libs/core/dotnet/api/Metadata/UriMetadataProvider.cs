using System.Reflection;
using Microsoft.AspNetCore.Http;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Api.Metadata
{
    public class UriMetadataProvider : IMetadataProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UriMetadataProvider(IHttpContextAccessor httpContextAccessor)
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
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
                yield break;

            var request = httpContext.Request;
            yield return new KeyValuePair<string, string>("request_uri", request.Path.ToString());
            yield return new KeyValuePair<string, string>(
                "request_proto",
                request.Protocol.ToUpperInvariant()
            );
            yield return new KeyValuePair<string, string>(
                "request_method",
                request.Method.ToUpperInvariant()
            );
        }
    }
}
