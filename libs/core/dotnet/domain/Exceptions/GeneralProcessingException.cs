using OpenSystem.Core.DotNet.Domain.Extensions;
using OpenSystem.Core.DotNet.Domain.ResultCodes;

namespace OpenSystem.Core.DotNet.Domain.Exceptions
{
    public class GeneralProcessingException : BaseException
    {
        public GeneralProcessingException()
          : base(typeof(ResultCodeApplication),
            ResultCodeGeneral.GeneralError)
        {
        }

        public GeneralProcessingException(Type? resultCodeType,
          int code)
          : base((resultCodeType == null
            ? typeof(ResultCodeGeneral)
            : resultCodeType),
              (!code.IsSet()
            ? ResultCodeGeneral.GeneralError
            : code))
        {
        }

        public GeneralProcessingException(Type? resultCodeType,
          int code,
          Exception exception)
            : base(resultCodeType,
                code,
                exception)
        {
        }

        public GeneralProcessingException(Exception exception)
            : base(typeof(ResultCodeGeneral),
                ResultCodeGeneral.GeneralError,
                exception)
        {
        }
    }
}
