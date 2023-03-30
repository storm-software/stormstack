using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Extensions;

namespace OpenSystem.Core.Domain.Exceptions
{
    public abstract class BaseException<TData> : Exception
    {
        public string? ExtendedMessage { get; set; }

        public string ResultType { get; init; }

        public int ResultCode { get; init; }

        public virtual ResultSeverityTypes Severity => ResultSeverityTypes.Error;

        public BaseException(
            Type resultType,
            int resultCode,
            string? extendedMessage = null,
            Exception? exception = null
        )
            : base(ResultCodes.ResultCode.Serialize(resultType, resultCode), exception)
        {
            ResultType = resultType.PrettyPrint();
            ResultCode = resultCode;
            ExtendedMessage = extendedMessage;
        }
    }

    public abstract class BaseException : BaseException<object>
    {
        public BaseException(
            Type resultType,
            int resultCode,
            string? extendedMessage = null,
            Exception? exception = null
        )
            : base(resultType, resultCode, extendedMessage, exception) { }
    }
}
