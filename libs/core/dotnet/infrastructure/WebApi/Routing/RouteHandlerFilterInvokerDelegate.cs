namespace OpenSystem.Core.Infrastructure.Routing
{
    internal delegate ValueTask<object?> RouteHandlerFilterInvokerDelegate(
        RouteHandlerInvocationContext context,
        RouteHandlerFilterDelegate next
    );
}
