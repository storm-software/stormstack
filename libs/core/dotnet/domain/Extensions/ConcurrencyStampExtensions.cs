
using OpenSystem.Core.Domain.Entities;

namespace OpenSystem.Core.Domain.Extensions
{
  public static class ConcurrencyStampExtensions
  {
    public static void SetConcurrencyStampIfNotNull(this IConcurrencyStamped entity,
      string? concurrencyStamp)
    {
      if (!string.IsNullOrEmpty(concurrencyStamp))
          entity.ConcurrencyStamp = concurrencyStamp;
    }
  }
}
