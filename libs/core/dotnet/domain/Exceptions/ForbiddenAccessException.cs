using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Exceptions
{
    public class ForbiddenAccessException : BaseException
    {
        public ForbiddenAccessException(string? extendedMessage = null)
          : base(typeof(ResultCodeSecurity),
            ResultCodeSecurity.ForbiddenAccess,
            extendedMessage)
        {
        }
    }
}
