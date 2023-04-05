using OpenSystem.Core.Application.Enums;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Application.Mediator.Attributes
{
    /// <summary>
    /// Bind property value to request body.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
    public class BaseSourceAttribute : Attribute, IModelNameProvider
    {
        public string? Name { get; init; }

        public BindingSource Source { get; init; }

        public BaseSourceAttribute(BindingSource source)
            : this(null, source) { }

        public BaseSourceAttribute(string? name, BindingSource source)
        {
            Name = name;
            Source = source;
        }
    }
}
