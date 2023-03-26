namespace OpenSystem.Core.Infrastructure.Routing
{
    public interface IRouteHandlerFilter
    {
        ValueTask<object?> InvokeAsync(
            RouteHandlerInvocationContext context,
            RouteHandlerFilterDelegate next
        );
    }
}
