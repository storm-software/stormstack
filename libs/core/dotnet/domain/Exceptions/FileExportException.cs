using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Exceptions
{
    public class FileExportException : BaseException
    {
      public FileExportException(string? extendedMessage = null,
        Exception? exception = null)
        : base(typeof(ResultCodeApplication),
            ResultCodeApplication.FileExportFailure,
            extendedMessage)
      {
      }

      public FileExportException(Exception exception)
          : base(typeof(ResultCodeApplication),
              ResultCodeApplication.FileExportFailure,
              exception.Message,
              exception)
        {
        }
    }
}
