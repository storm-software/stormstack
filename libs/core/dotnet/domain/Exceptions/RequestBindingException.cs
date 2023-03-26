using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Exceptions
{
    public class RequestBindingException : BaseException
    {
        public RequestBindingException(string? extendedMessage = null, Exception? exception = null)
            : base(
                typeof(ResultCodeApplication),
                ResultCodeApplication.InvalidRequestSentToServer,
                extendedMessage
            ) { }

        public RequestBindingException(Exception exception)
            : base(
                typeof(ResultCodeApplication),
                ResultCodeApplication.InvalidRequestSentToServer,
                exception.Message,
                exception
            ) { }
    }
}
