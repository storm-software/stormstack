namespace OpenSystem.Core.Domain.Common
{
    public interface IVersioned
    {
        public ulong EventCounter { get; set; }
    }
}
