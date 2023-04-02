namespace OpenSystem.Core.Domain.Common
{
    public interface IIdentity
    {
        string Value { get; }

        Guid GetGuid();

        IEnumerable<IFieldValidationResult> Validate(string value, string? fieldName = null);
    }
}
