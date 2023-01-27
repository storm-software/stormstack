


using OpenSystem.Core.DotNet.Domain.Extensions;
using OpenSystem.Core.DotNet.Domain.ResultCodes;

namespace OpenSystem.Core.DotNet.Domain.Exceptions
{
    public class BaseException : InvalidOperationException
    {
        public BaseException()
          : base(ResultCode.Serialize(typeof(ResultCodeGeneral),
            ResultCodeGeneral.GeneralError))
        {
        }

        public BaseException(string? errorMessage)
          : base(!string.IsNullOrEmpty(errorMessage)
            ? errorMessage
            : ResultCode.Serialize(typeof(ResultCodeGeneral),
                ResultCodeGeneral.GeneralError))
        {
        }

        public BaseException(Type? resultCodeType,
          int code)
          : base(resultCodeType == null || !code.IsSet()
            ? ResultCode.Serialize(typeof(ResultCodeGeneral),
                ResultCodeGeneral.GeneralError)
            : ResultCode.Serialize(resultCodeType,
                code))
        {
        }
    }
}
