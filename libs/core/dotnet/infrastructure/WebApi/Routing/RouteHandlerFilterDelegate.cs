using Microsoft.AspNetCore.Http;

namespace OpenSystem.Core.Infrastructure.Routing
{
    public delegate ValueTask<object?> RouteHandlerFilterDelegate(
        RouteHandlerInvocationContext context
    );
}
