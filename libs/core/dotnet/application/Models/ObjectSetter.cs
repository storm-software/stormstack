using System.Reflection;
using Microsoft.Extensions.Primitives;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Exceptions;

namespace OpenSystem.Core.Application.Models
{
    public delegate void PropertySetterDelegate(object obj, object? value);

    public delegate object ObjectParserDelegate(StringValues input);

    public delegate bool GenericSetterDelegate<T>(string value, out T result);

    public abstract class ObjectSetter
    {
        protected readonly PropertySetterDelegate Setter;

        public ObjectSetter(PropertyInfo propertyInfo)
        {
            Setter = propertyInfo.SetValue;
        }

        public abstract void SetValue(object obj, StringValues value);

        protected static void ThrowInvalidBinding(StringValues value, Type type) =>
            throw new RequestBindingException(
                $"Unable to convert '{value}' to '{type.FullName}' type"
            );
    }

    public sealed class DefaultObjectSetter : ObjectSetter
    {
        private readonly ObjectParserDelegate _parser;

        public DefaultObjectSetter(PropertyInfo propertyInfo, ObjectParserDelegate parser)
            : base(propertyInfo)
        {
            _parser = parser;
        }

        public override void SetValue(object obj, StringValues value)
        {
            var result = _parser(value);
            Setter(obj, result);
        }
    }

    public sealed class StringSetter : ObjectSetter
    {
        public StringSetter(PropertyInfo propertyInfo)
            : base(propertyInfo) { }

        public override void SetValue(object obj, StringValues value) =>
            Setter(obj, value.ToString());
    }

    public sealed class StringsSetter : ObjectSetter
    {
        public StringsSetter(PropertyInfo propertyInfo)
            : base(propertyInfo) { }

        public override void SetValue(object obj, StringValues value) =>
            Setter(obj, value.ToArray());
    }

    public sealed class EnumSetter : ObjectSetter
    {
        private readonly Type _type;

        public EnumSetter(PropertyInfo propertyInfo, Type type)
            : base(propertyInfo)
        {
            _type = type;
        }

        public override void SetValue(object obj, StringValues value)
        {
            if (value.Count == 0)
                return;
            if (Enum.TryParse(_type, value[0], true, out var result))
                Setter(obj, result);
            ThrowInvalidBinding(value, _type);
        }
    }

    public sealed class ObjectSetter<T> : ObjectSetter
    {
        private readonly GenericSetterDelegate<T> _parser;

        public ObjectSetter(PropertyInfo propertyInfo, GenericSetterDelegate<T> parser)
            : base(propertyInfo)
        {
            _parser = parser;
        }

        public override void SetValue(object obj, StringValues value)
        {
            if (value.Count == 0)
                return;
            var rawValue = value[0];
            var success = _parser(rawValue, out var result);
            if (!success)
                ThrowInvalidBinding(value, typeof(T));

            Setter(obj, result);
        }
    }

    public sealed class ParseableSetter : ObjectSetter
    {
        private readonly MethodInfo _parser;

        public ParseableSetter(PropertyInfo propertyInfo, MethodInfo parser)
            : base(propertyInfo)
        {
            _parser = parser;
        }

        public override void SetValue(object obj, StringValues value)
        {
            if (obj is IParseable parsed && parsed.TryParse(value[0], out var result))
            {
                Setter(obj, result);
                return;
            }

            var valueAsString = value.ToString();
            object?[] args = { valueAsString, null };
            if (valueAsString is not null && _parser.Invoke(null, args) is true)
                Setter(obj, args[1]);
        }
    }
}
