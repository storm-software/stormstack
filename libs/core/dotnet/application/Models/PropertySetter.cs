using System.Reflection;
using Microsoft.Extensions.Primitives;

namespace OpenSystem.Core.Application.Models
{
    public sealed class PropertySetter
    {
        public string Name { get; set; }

        public Action<object, StringValues> SetValue { get; }

        public PropertySetter(PropertyInfo propertyInfo, string? name = null)
        {
            Name = name ?? propertyInfo.Name;

            if (IsStringEnumerable(propertyInfo.PropertyType))
            {
                SetValue = new StringsSetter(propertyInfo).SetValue;
                return;
            }

            var type = GetBaseType(propertyInfo.PropertyType);
            SetValue = GetSetter(type, propertyInfo).SetValue;
        }

        public PropertySetter(string name, ObjectSetter setter)
        {
            Name = name;
            SetValue = setter.SetValue;
        }

        private static ObjectSetter GetSetter(Type type, PropertyInfo propertyInfo)
        {
            if (type == typeof(string))
                return new StringSetter(propertyInfo);

            if (type.IsEnum)
                return new EnumSetter(propertyInfo, type);

            if (type == typeof(int))
                return new ObjectSetter<int>(propertyInfo, int.TryParse);
            if (type == typeof(long))
                return new ObjectSetter<long>(propertyInfo, long.TryParse);
            if (type == typeof(bool))
                return new ObjectSetter<bool>(propertyInfo, bool.TryParse);
            if (type == typeof(double))
                return new ObjectSetter<double>(propertyInfo, double.TryParse);
            if (type == typeof(float))
                return new ObjectSetter<float>(propertyInfo, float.TryParse);
            if (type == typeof(decimal))
                return new ObjectSetter<decimal>(propertyInfo, decimal.TryParse);
            if (type == typeof(DateTime))
                return new ObjectSetter<DateTime>(propertyInfo, DateTime.TryParse);
            if (type == typeof(DateTimeOffset))
                return new ObjectSetter<DateTimeOffset>(propertyInfo, DateTimeOffset.TryParse);
            if (type == typeof(TimeSpan))
                return new ObjectSetter<TimeSpan>(propertyInfo, TimeSpan.TryParse);
            if (type == typeof(Guid))
                return new ObjectSetter<Guid>(propertyInfo, Guid.TryParse);
            if (type == typeof(byte))
                return new ObjectSetter<byte>(propertyInfo, byte.TryParse);
            if (type == typeof(sbyte))
                return new ObjectSetter<sbyte>(propertyInfo, sbyte.TryParse);
            if (type == typeof(short))
                return new ObjectSetter<short>(propertyInfo, short.TryParse);
            if (type == typeof(ushort))
                return new ObjectSetter<ushort>(propertyInfo, ushort.TryParse);
            if (type == typeof(uint))
                return new ObjectSetter<uint>(propertyInfo, uint.TryParse);
            if (type == typeof(ulong))
                return new ObjectSetter<ulong>(propertyInfo, ulong.TryParse);
            if (type == typeof(char))
                return new ObjectSetter<char>(propertyInfo, char.TryParse);

            var parser = GetParser(type);
            if (parser is null)
            {
                throw new NotSupportedException($"Type not supported: {type.Name}");
            }

            return new ParseableSetter(propertyInfo, parser);
        }

        private static MethodInfo? GetParser(Type type)
        {
            var paramTypes = new[] { typeof(string), type.MakeByRefType() };
            return type.GetMethod("TryParse", paramTypes);
        }

        private static void ArraySetter(
            object obj,
            StringValues values,
            Action<object, StringValues> setter
        )
        {
            foreach (string item in values)
            {
                setter(obj, item);
            }
        }

        private static void EnumSetter(
            object obj,
            string? value,
            Type type,
            PropertyInfo propertyInfo
        )
        {
            if (value is not null && Enum.TryParse(type, value, true, out var result))
                propertyInfo.SetValue(obj, result);
        }

        private static void ParseableSetter(
            object obj,
            string? value,
            PropertyInfo propertyInfo,
            MethodBase parser
        )
        {
            object?[] args = { value, null };
            if (value is not null && parser.Invoke(null, args) is true)
            {
                propertyInfo.SetValue(obj, args[1]);
            }
        }

        private static bool IsStringEnumerable(Type type)
        {
            return type == typeof(string[])
                || type == typeof(StringValues)
                || type == typeof(IEnumerable<string>);
        }

        private static bool IsNullable(Type type)
        {
            return type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>);
        }

        private static bool IsEnumerable(Type type)
        {
            return type.IsGenericType && type.GetGenericTypeDefinition() == typeof(IEnumerable<>);
        }

        private static Type GetBaseType(Type type)
        {
            return Nullable.GetUnderlyingType(type) ?? type;
        }
    }
}
