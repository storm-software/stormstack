namespace OpenSystem.Core.Domain.Common
{
    public interface IFieldValidationResult : IBaseResult
    {
        string FieldName { get; set; }

        object? AttemptedValue { get; set; }

        bool Equals(object? obj);

        int GetHashCode();
    }
}
