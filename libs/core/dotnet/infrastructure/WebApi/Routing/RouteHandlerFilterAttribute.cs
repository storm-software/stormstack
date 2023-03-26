namespace OpenSystem.Core.Infrastructure.Routing
{
    public abstract class RouteHandlerFilterAttribute : Attribute, IRouteHandlerFilter
    {
        public abstract ValueTask<object?> InvokeAsync(
            RouteHandlerInvocationContext context,
            RouteHandlerFilterDelegate next
        );
    }
}
