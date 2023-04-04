namespace OpenSystem.Core.Api
{
    internal sealed class FilterEndpointRouteHandler : EndpointRouteHandler
    {
        private readonly RouteHandlerFilterInvokerDelegate _invoker;

        internal FilterEndpointRouteHandler(
            RouteHandlerFilterInvokerDelegate invoker,
            RouteHandlerFilterDelegate action
        )
            : base(action)
        {
            _invoker = invoker;
        }

        internal override ValueTask<object?> Invoke(RouteHandlerInvocationContext context)
        {
            return _invoker(context, Action);
        }
    }
}
