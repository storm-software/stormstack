using System.Globalization;
using OpenSystem.Core.DotNet.Domain.Common;
using OpenSystem.Core.DotNet.Domain.ValueObjects;

namespace OpenSystem.Core.DotNet.Domain.Entities
{
    public class ResultMessage
      : BaseEntity<ResultMessageId, ResultMessageKey>
    {
      public CultureInfo Culture { get; set; }

      public string Message { get; set; }

      public string ExtendedMessage { get; set; }
    }
}
