using Microsoft.AspNetCore.Http;

namespace OpenSystem.Core.Api
{
    internal sealed class DefaultRouteHandlerInvocationContext : RouteHandlerInvocationContext
    {
        public override IList<object?> Arguments { get; }

        public override HttpContext HttpContext { get; }

        internal DefaultRouteHandlerInvocationContext(HttpContext httpContext, object obj)
        {
            HttpContext = httpContext;
            Arguments = new List<object?>();
            Arguments.Add(obj);
        }

        internal DefaultRouteHandlerInvocationContext(
            HttpContext httpContext,
            IEnumerable<object> objects
        )
        {
            HttpContext = httpContext;
            Arguments = new List<object?>(objects);
        }

        internal T GetArgument<T>(int index)
        {
            return (T)Arguments[index]!;
        }
    }
}
