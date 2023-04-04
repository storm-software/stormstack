using System.Reflection;
using Microsoft.AspNetCore.Http;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Api.Metadata
{
    public class UserHostAddressMetadataProvider : IMetadataProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        private static readonly IEnumerable<string> HeaderPriority = new[]
        {
            "X-Forwarded-For",
            "HTTP_X_FORWARDED_FOR",
            "X-Real-IP",
            "REMOTE_ADDR"
        };

        public UserHostAddressMetadataProvider(IHttpContextAccessor httpContextAccessor)
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

            yield return new KeyValuePair<string, string>(
                "remote_ip_address",
                httpContext.Connection.RemoteIpAddress?.ToString()
            );

            var headerInfo = HeaderPriority
                .Select(h =>
                {
                    var address = httpContext.Request.Headers.TryGetValue(h, out var value)
                        ? string.Join(string.Empty, value)
                        : string.Empty;
                    return new { Header = h, Address = address };
                })
                .FirstOrDefault(a => !string.IsNullOrEmpty(a.Address));

            if (headerInfo == null)
            {
                yield break;
            }

            yield return new KeyValuePair<string, string>("user_host_address", headerInfo.Address);
            yield return new KeyValuePair<string, string>(
                "user_host_address_source_header",
                headerInfo.Header
            );
        }
    }
}
