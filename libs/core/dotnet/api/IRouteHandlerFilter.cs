namespace OpenSystem.Core.Api
{
    public interface IRouteHandlerFilter
    {
        ValueTask<object?> InvokeAsync(
            RouteHandlerInvocationContext context,
            RouteHandlerFilterDelegate next
        );
    }
}
