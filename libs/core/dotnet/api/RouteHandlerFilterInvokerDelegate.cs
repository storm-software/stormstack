namespace OpenSystem.Core.Api
{
    internal delegate ValueTask<object?> RouteHandlerFilterInvokerDelegate(
        RouteHandlerInvocationContext context,
        RouteHandlerFilterDelegate next
    );
}
