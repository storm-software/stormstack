using System;

namespace OpenSystem.Core.Application.Interfaces
{
    public interface IDateTimeProvider
    {
      DateTime Now { get; }

      DateTime UtcNow { get; }

      DateTimeOffset OffsetNow { get; }

      DateTimeOffset OffsetUtcNow { get; }
    }
}
