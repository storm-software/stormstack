


using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Exceptions
{
    public class BaseException : Exception
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

        public BaseException(Type resultCodeType,
          int code)
          : base(resultCodeType == null || !code.IsSet()
            ? ResultCode.Serialize(typeof(ResultCodeGeneral),
                ResultCodeGeneral.GeneralError)
            : ResultCode.Serialize(resultCodeType,
                code))
        {
        }

         public BaseException(Type resultCodeType,
          int code,
          Exception exception)
          : base((resultCodeType == null || !code.IsSet()
            ? ResultCode.Serialize(typeof(ResultCodeGeneral),
                ResultCodeGeneral.GeneralError)
            : ResultCode.Serialize(resultCodeType,
                code)),
                exception)
        {
        }

        public BaseException(string resultCodeType,
          int code)
          : base(resultCodeType == null || !code.IsSet()
            ? ResultCode.Serialize(typeof(ResultCodeGeneral),
                ResultCodeGeneral.GeneralError)
            : ResultCode.Serialize(resultCodeType,
                code))
        {
        }

         public BaseException(string resultCodeType,
          int code,
          Exception exception)
          : base((resultCodeType == null || !code.IsSet()
            ? ResultCode.Serialize(typeof(ResultCodeGeneral),
                ResultCodeGeneral.GeneralError)
            : ResultCode.Serialize(resultCodeType,
                code)),
                exception)
        {
        }
    }
}
