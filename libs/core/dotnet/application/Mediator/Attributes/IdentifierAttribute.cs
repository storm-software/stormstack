using OpenSystem.Core.Application.Enums;

namespace OpenSystem.Core.Application.Mediator.Attributes
{
    /// <summary>
    /// Bind value from route path
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public sealed class IdentifierAttribute : BaseSourceAttribute
    {
        /// <summary>
        /// Bind value from route path
        /// </summary>
        public IdentifierAttribute()
            : this(null) { }

        /// <summary>
        /// Bind value from route path
        /// </summary>
        /// <param name="name">When null, will use property name</param>
        public IdentifierAttribute(string? name)
            : base(name, BindingSource.Identifier) { }
    }
}
