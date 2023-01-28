using OpenSystem.Core.DotNet.Domain.Extensions;
using OpenSystem.Core.DotNet.Domain.ResultCodes;

namespace OpenSystem.Core.DotNet.Domain.Exceptions
{
    public class ForbiddenAccessException : BaseException
    {
        public ForbiddenAccessException()
          : base(typeof(ResultCodeSecurity),
            ResultCodeSecurity.ForbiddenAccess)
        {
        }

        public ForbiddenAccessException(Type? resultCodeType,
          int code)
          : base((resultCodeType == null
            ? typeof(ResultCodeSecurity)
            : resultCodeType),
              (!code.IsSet()
            ? ResultCodeSecurity.ForbiddenAccess
            : code))
        {
        }

        public ForbiddenAccessException(Type? resultCodeType,
          int code,
          Exception exception)
            : base(resultCodeType,
                code,
                exception)
        {
        }

        public ForbiddenAccessException(Exception exception)
            : base(typeof(ResultCodeSecurity),
                ResultCodeSecurity.ForbiddenAccess,
                exception)
        {
        }
    }
}
