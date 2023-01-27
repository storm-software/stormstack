


using OpenSystem.Core.DotNet.Domain.Extensions;
using OpenSystem.Core.DotNet.Domain.ResultCodes;

namespace OpenSystem.Core.DotNet.Domain.Exceptions
{
    public class ValueCannotBeEmptyException : BaseException
    {
        public ValueCannotBeEmptyException()
          : base(typeof(ResultCodeApplication),
            ResultCodeApplication.FieldNotSet)
        {
        }

        public ValueCannotBeEmptyException(Type? resultCodeType,
          int code)
          : base(resultCodeType == null || !code.IsSet()
            ? ResultCode.Serialize(typeof(ResultCodeApplication),
                ResultCodeApplication.FieldNotSet)
            : ResultCode.Serialize(resultCodeType,
                code))
        {
        }
    }
}
