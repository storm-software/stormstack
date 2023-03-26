using OpenSystem.Core.Application.Enums;

namespace OpenSystem.Core.Application.Attributes
{
    public sealed class QueryFilterAttribute : BaseSourceAttribute
    {
        /// <summary>
        /// Bind value from query string
        /// </summary>
        public QueryFilterAttribute()
            : this(null) { }

        /// <summary>
        /// Bind value from query string
        /// </summary>
        /// <param name="name">Name alias. When null, will use the name of property.</param>
        public QueryFilterAttribute(string? name)
            : base(name, BindingSource.QueryFilter) { }
    }
}
