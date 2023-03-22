


using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Exceptions
{
  public class BaseException<TData>
    : Exception
  {
    public IResult<TData> Result { get; set; }

    public BaseException(IResult<TData> result)
      : base(ResultCode.Serialize(result.Type,
        result.Code))
    {
      Result = result;
    }

    public BaseException(Type type,
      int code,
      Exception exception)
      : base(ResultCode.Serialize(type,
        code),
        exception)
    {
      Result = Result<TData>.Failure(exception,
        ResultSeverityTypes.Error,
        type,
        code);
    }

    public BaseException(Type type,
      int code,
      string? detail = null,
      string? extendedDetail = null,
      ResultSeverityTypes severity = ResultSeverityTypes.Error,
      string? helpLink = null,
      IList<FieldValidationResult>? fields = null,
      Dictionary<string, object>? formattedMessagePlaceholderValues = null)
      : base(!string.IsNullOrEmpty(detail)
          ? detail
          : ResultCode.Serialize(type,
            code))
    {
      Result = Result<TData>.Failure(type,
        code,
        detail,
        extendedDetail,
        severity,
        helpLink,
        fields,
        formattedMessagePlaceholderValues);
    }

    public BaseException(string type,
      int code,
      string? detail = null,
      string? extendedDetail = null,
      ResultSeverityTypes severity = ResultSeverityTypes.Error,
      string? helpLink = null,
      Dictionary<string, object>? formattedMessagePlaceholderValues = null)
      : base(!string.IsNullOrEmpty(detail)
          ? detail
          : ResultCode.Serialize(type,
            code))
    {
      Result = Result<TData>.Failure(type,
        code,
        detail,
        extendedDetail,
        severity,
        helpLink,
        formattedMessagePlaceholderValues);
    }
  }

  public class BaseException
    : BaseException<object>
  {
    public BaseException(IResult<object> result)
      : base(result)
    {
    }

    public BaseException(Type type,
      int code,
      Exception exception)
      : base(type,
        code,
        exception)
    {
    }

    public BaseException(Type type,
        int code,
      string? detail = null,
      string? extendedDetail = null,
      ResultSeverityTypes severity = ResultSeverityTypes.Error,
      string? helpLink = null,
      IList<FieldValidationResult>? fields = null,
      Dictionary<string, object>? formattedMessagePlaceholderValues = null)
      : base(type,
        code,
        detail,
        extendedDetail,
        severity,
        helpLink,
        fields,
        formattedMessagePlaceholderValues)
    {
    }

    public BaseException(string type,
        int code,
      string? detail = null,
      string? extendedDetail = null,
      ResultSeverityTypes severity = ResultSeverityTypes.Error,
      string? helpLink = null,
      Dictionary<string, object>? formattedMessagePlaceholderValues = null)
      : base(type,
        code,
        detail,
        extendedDetail,
        severity,
        helpLink,
        formattedMessagePlaceholderValues)
    {
    }
  }
}
