using System;
using OpenSystem.Core.Domain.Attributes;

namespace OpenSystem.Core.Application.Jobs
{
    [AttributeUsage(AttributeTargets.Class)]
    public class JobVersionAttribute : VersionAttribute
    {
        public JobVersionAttribute(string name, ulong version)
            : base(name, version) { }
    }
}
