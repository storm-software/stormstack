using System;

namespace OpenSystem.Core.Domain.Attributes
{
    public abstract class VersionAttribute : Attribute
    {
        public string Name { get; }
        public ulong Version { get; }

        protected VersionAttribute(string name, ulong version)
        {
            if (string.IsNullOrEmpty(name))
                throw new ArgumentNullException(nameof(name));
            if (version <= 0)
                throw new ArgumentOutOfRangeException(nameof(version), "Version must be positive");

            Name = name;
            Version = version;
        }
    }
}
