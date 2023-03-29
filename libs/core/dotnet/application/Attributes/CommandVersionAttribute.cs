using OpenSystem.Core.Domain.Attributes;

namespace OpenSystem.Core.Application.Attributes
{
    [AttributeUsage(AttributeTargets.Class)]
    public class CommandVersionAttribute : VersionAttribute
    {
        public CommandVersionAttribute(string name, uint version)
            : base(name, version) { }
    }
}
