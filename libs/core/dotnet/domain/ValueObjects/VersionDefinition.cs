using System.Reflection;
using OpenSystem.Core.Domain.Extensions;

namespace OpenSystem.Core.Domain.ValueObjects
{
    public abstract class VersionDefinition : ValueObject
    {
        public ulong Version { get; }

        public Type Type { get; }

        public string Name { get; }

        protected VersionDefinition(ulong version, Type type, string name)
        {
            Version = version;
            Type = type;
            Name = name;
        }

        public override string ToString()
        {
            var assemblyName = Type.GetTypeInfo().Assembly.GetName();
            return $"{Name} v{Version} ({assemblyName.Name} - {Type.PrettyPrint()})";
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Version;
            yield return Type;
            yield return Name;
        }
    }
}
