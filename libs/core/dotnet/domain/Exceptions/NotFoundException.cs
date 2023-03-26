using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Exceptions
{
    public class NotFoundException : BaseException
    {
        public NotFoundException(string? extendedMessage = null)
          : base(typeof(ResultCodeApplication),
            ResultCodeApplication.NoResultsFound,
            extendedMessage)
        {
        }
    }
}
