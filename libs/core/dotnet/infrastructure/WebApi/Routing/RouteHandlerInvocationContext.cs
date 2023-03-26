using Microsoft.AspNetCore.Http;

namespace OpenSystem.Core.Infrastructure.Routing
{
    public abstract class RouteHandlerInvocationContext
    {
        public abstract IList<object?> Arguments { get; }

        public abstract HttpContext HttpContext { get; }
    }
}
