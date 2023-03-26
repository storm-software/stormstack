using System.Reflection;
using OpenSystem.Core.Infrastructure.Routing;

namespace OpenSystem.Core.Infrastructure.Utilities
{
    public static class RouteFilterUtility
    {
        public static IEnumerable<RouteHandlerFilterAttribute> GetFilters(MemberInfo type) =>
            type.GetCustomAttributes<RouteHandlerFilterAttribute>().Reverse().ToList();
    }
}
