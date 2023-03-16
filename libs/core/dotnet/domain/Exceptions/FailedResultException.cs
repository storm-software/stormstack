using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Exceptions
{
    public class FailedResultException<TData> : BaseException
    {
      public IResult<TData> Result { get; set; }

      public FailedResultException(IResult<TData> result)
        : base(result.ResultCodeType,
          result.Code)
      {
        Result = result;
      }

      public FailedResultException(Type resultCodeType,
        int code)
        : base(resultCodeType,
          code)
      {
        Result = ResultCodes.Result<TData>.Failure(resultCodeType,
          code);
      }

      public FailedResultException(string resultCodeType,
        int code)
        : base(resultCodeType,
          code)
      {
        Result = ResultCodes.Result<TData>.Failure(resultCodeType,
          code);
      }
    }

    public class FailedResultException : FailedResultException<object>
    {
      public FailedResultException(IResult<object> result)
        : base(result)
      {
      }

      public FailedResultException(Type resultCodeType,
        int code)
        : base(resultCodeType,
          code)
      {
        Result = ResultCodes.Result.Failure(resultCodeType,
          code);
      }

      public FailedResultException(string resultCodeType,
        int code)
        : base(resultCodeType,
          code)
      {
        Result = ResultCodes.Result.Failure(resultCodeType,
          code);
      }
    }
}
