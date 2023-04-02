namespace OpenSystem.Core.Domain.Attributes
{
    [AttributeUsage(AttributeTargets.Class)]
    public class SnapshotVersionAttribute : VersionAttribute
    {
        public SnapshotVersionAttribute(string name, ulong version)
            : base(name, version) { }
    }
}
