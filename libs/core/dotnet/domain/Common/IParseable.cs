namespace OpenSystem.Core.Domain.Common
{
    public interface IParseable
    {
        bool TryParse(string value, out object result);
    }
}
