using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Utilities
{
    public class SingleValueObjectConverter : JsonConverter<ISingleValueObject>
    {
        private static readonly ConcurrentDictionary<Type, Type> ConstructorArgumentTypes =
            new ConcurrentDictionary<Type, Type>();

        public override ISingleValueObject Read(
            ref Utf8JsonReader reader,
            Type typeToConvert,
            JsonSerializerOptions options
        )
        {
            if (string.IsNullOrEmpty(reader.GetString()))
                return null;

            var value = JsonSerializer.Deserialize(
                ref reader,
                ConstructorArgumentTypes.GetOrAdd(
                    typeToConvert,
                    t =>
                    {
                        var constructorInfo = typeToConvert
                            .GetTypeInfo()
                            .GetConstructors(BindingFlags.Public | BindingFlags.Instance)
                            .Single();
                        var parameterInfo = constructorInfo.GetParameters().Single();
                        return parameterInfo.ParameterType;
                    }
                )
            );

            return (ISingleValueObject)Activator.CreateInstance(typeToConvert, value);
        }

        public override void Write(
            Utf8JsonWriter writer,
            ISingleValueObject value,
            JsonSerializerOptions options
        )
        {
            if (!(value is ISingleValueObject singleValueObject))
            {
                return;
            }

            JsonSerializer.Serialize(writer, singleValueObject.GetValue());
        }

        public override bool CanConvert(Type objectType)
        {
            return typeof(ISingleValueObject).GetTypeInfo().IsAssignableFrom(objectType);
        }
    }
}
