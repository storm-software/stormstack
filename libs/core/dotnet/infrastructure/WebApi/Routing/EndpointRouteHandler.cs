namespace OpenSystem.Core.Infrastructure.Routing
{
    internal class EndpointRouteHandler
    {
        protected readonly RouteHandlerFilterDelegate Action;

        internal EndpointRouteHandler(RouteHandlerFilterDelegate action)
        {
            Action = action;
        }

        internal virtual ValueTask<object?> Invoke(RouteHandlerInvocationContext context)
        {
            return Action(context);
        }
    }
}
