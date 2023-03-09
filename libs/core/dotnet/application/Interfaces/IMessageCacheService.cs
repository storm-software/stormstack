using System.Globalization;
using OpenSystem.Core.Application.Models.DTOs;

namespace OpenSystem.Core.Application.Interfaces
{
  public interface IMessageCacheService
  {
    Task<IEnumerable<MessageRecord>> GetMessagesAsync(CultureInfo? culture = null);

    Task<IEnumerable<MessageRecord>> GetMessagesAsync(string? type,
      CultureInfo? culture = null);

    Task<MessageRecord?> GetMessageAsync(string type,
      int? code = null,
      CultureInfo? culture = null);
  }
}
