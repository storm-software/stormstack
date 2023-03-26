using System.Reflection;

namespace OpenSystem.Core.Application.Models
{
    public sealed class PropertySetterCollection : List<PropertySetter>
    {
        public void Add(string? name, PropertyInfo property, ObjectParserCollection parsers)
        {
            var baseType =
                Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType;
            if (parsers.TryGetValue(baseType, out var parser))
            {
                Add(
                    new PropertySetter(
                        name ?? property.Name,
                        new DefaultObjectSetter(property, parser)
                    )
                );
                return;
            }

            Add(new PropertySetter(property, name));
        }
    }
}
