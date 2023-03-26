using OpenSystem.Core.Application.Enums;

namespace OpenSystem.Core.Application.Attributes
{
    /// <summary>
    /// Bind value from query string.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public sealed class MetadataAttribute : BaseSourceAttribute
    {
        public MetadataAttribute(string? name)
            : base(name, BindingSource.Metadata) { }

        public MetadataAttribute()
            : this(null) { }
    }
}
