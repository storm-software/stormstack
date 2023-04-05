using System.Reflection;

namespace OpenSystem.Core.Api.Utilities
{
    public static class RouteFilterUtility
    {
        public static IEnumerable<RouteHandlerFilterAttribute> GetFilters(MemberInfo type) =>
            type.GetCustomAttributes<RouteHandlerFilterAttribute>().Reverse().ToList();
    }
}
