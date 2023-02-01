


using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Exceptions
{
    public class ValueCannotBeEmptyException : ValidationException
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
