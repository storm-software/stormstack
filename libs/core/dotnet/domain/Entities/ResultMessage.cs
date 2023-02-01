using System.Globalization;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Entities
{
    public class ResultMessage
      : Entity<ResultMessageId>
    {
      public ResultMessageId? Id { get; init; }

      public CultureInfo Culture { get; set; }

      public string Message { get; set; }

      public string ExtendedMessage { get; set; }
    }
}
