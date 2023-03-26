using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Exceptions
{
    public class GeneralProcessingException : BaseException
    {
        public GeneralProcessingException(Type resultType,
          int resultCode,
          string? extendedMessage = null,
          Exception? exception = null)
          : base(resultType,
            resultCode,
            extendedMessage,
            exception)
        {
        }

        public GeneralProcessingException(string? extendedMessage = null,
          Exception? exception = null)
          : base(typeof(ResultCodeApplication),
            ResultCodeGeneral.GeneralError,
            extendedMessage,
            exception)
        {
        }
    }
}
