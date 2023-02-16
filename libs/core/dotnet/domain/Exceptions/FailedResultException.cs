using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Exceptions
{
    public class FailedResultException : BaseException
    {
      public IResult<object> Result { get; set; }

      public FailedResultException(IResult<object> _result)
        : base(_result.ResultCodeType,
          _result.Code ?? 0)
      {
        Result = _result;
      }
    }
}
