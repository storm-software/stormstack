using OpenSystem.Core.DotNet.Domain.Extensions;
using OpenSystem.Core.DotNet.Domain.ResultCodes;

namespace OpenSystem.Core.DotNet.Domain.Exceptions
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
