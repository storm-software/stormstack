namespace OpenSystem.Core.Domain.Common
{
    public interface IResult<in T> : IBaseResult
    {
        public object? Data { get; set; }

        public string? HelpLink { get; set; }

        public List<IFieldValidationResult> Failures { get; init; }
    }
}
