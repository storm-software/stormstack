using System.Globalization;
using OpenSystem.Core.DotNet.Domain.Common;
using OpenSystem.Core.DotNet.Domain.ValueObjects;

namespace OpenSystem.Core.DotNet.Domain.Entities
{
    public class ResultMessage
      : BaseEntity
    {
      public new ResultMessageId? Id { get; init; }

      public CultureInfo Culture { get; set; }

      public string Message { get; set; }

      public string ExtendedMessage { get; set; }
    }
}
