using System;

namespace OpenSystem.Core.Domain.Attributes
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public class EventVersionAttribute : VersionAttribute
    {
        public EventVersionAttribute(string name, ulong version)
            : base(name, version) { }
    }
}
