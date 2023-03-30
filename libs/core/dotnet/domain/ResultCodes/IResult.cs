using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.ResultCodes
{
    public interface IResult<T> : IBaseResult
    {
        public T? Data { get; set; }

        public string? HelpLink { get; set; }

        public List<FieldValidationResult> Failures { get; init; }
    }
}
