using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Exceptions
{
    public class NotFoundException : BaseException
    {
        public NotFoundException()
          : base(typeof(ResultCodeApplication),
            ResultCodeApplication.NoResultsFound)
        {
        }

        public NotFoundException(Type? resultCodeType,
          int code)
          : base((resultCodeType == null
            ? typeof(ResultCodeApplication)
            : resultCodeType),
              (!code.IsSet()
            ? ResultCodeApplication.NoResultsFound
            : code))
        {
        }

        public NotFoundException(Type? resultCodeType,
          int code,
          Exception exception)
            : base(resultCodeType,
                code,
                exception)
        {
        }

        public NotFoundException(Exception exception)
            : base(typeof(ResultCodeApplication),
                ResultCodeApplication.NoResultsFound,
                exception)
        {
        }
    }
}
