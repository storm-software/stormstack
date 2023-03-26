


using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Exceptions
{
    public class RequiredFieldException : ValidationException
    {
        public RequiredFieldException(string? extendedMessage = null)
          : base(typeof(ResultCodeValidation),
            ResultCodeValidation.RequiredFieldMissing,
            extendedMessage)
        {
        }
    }
}
