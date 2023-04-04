using Microsoft.AspNetCore.Http;

namespace OpenSystem.Core.Api
{
    public delegate ValueTask<object?> RouteHandlerFilterDelegate(
        RouteHandlerInvocationContext context
    );
}
