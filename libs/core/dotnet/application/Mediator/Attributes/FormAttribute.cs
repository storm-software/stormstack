using OpenSystem.Core.Application.Enums;

namespace OpenSystem.Core.Application.Mediator.Attributes
{
    /// <summary>
    /// Bind property value from form content.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public sealed class FormAttribute : BaseSourceAttribute
    {
        /// <summary>
        /// Bind property value from form content.
        /// </summary>
        /// <param name="name">Name alias. When null, will use name of the property.</param>
        public FormAttribute(string? name)
            : base(name, BindingSource.Form)
        {
            Name = name;
        }

        public FormAttribute()
            : this(null) { }
    }
}
