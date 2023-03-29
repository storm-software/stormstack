using System;

namespace OpenSystem.Core.Domain.Attributes
{
    [AttributeUsage(AttributeTargets.Class)]
    public class JobVersionAttribute : VersionAttribute
    {
        public JobVersionAttribute(string name, uint version)
            : base(name, version) { }
    }
}
