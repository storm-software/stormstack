using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Common
{
    public interface IResult<T>
      : IBaseResult
    {
      public T? Data { get; set; }

      public string? HelpLink { get; set; }

      public string? StackTrace { get; set; }

      public IList<FieldValidationResult> Fields { get; init; }
    }
}
