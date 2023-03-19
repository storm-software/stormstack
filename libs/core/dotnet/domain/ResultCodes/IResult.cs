using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Common
{
    public interface IResult<T>
      : IBaseResult
    {
      public T? Data { get; set; }
    }
}
