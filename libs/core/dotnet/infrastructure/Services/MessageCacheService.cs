using OpenSystem.Core.Application.Models.DTOs;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Application.Extensions;
using System.Globalization;
using Microsoft.Extensions.Caching.Distributed;
using OpenSystem.Core.Domain.Constants;

namespace OpenSystem.Core.Infrastructure.Services
{
  public class MessageCacheService : IMessageCacheService
  {
    private IDistributedCache _cache { get; init; }

    public MessageCacheService(IDistributedCache cache)
    {
      _cache = cache;
    }

    public async Task<IEnumerable<MessageRecord>> GetMessagesAsync(CultureInfo? culture = null)
    {
      culture ??= new CultureInfo(DefaultConfiguration.DefaultCulture);
      return await _cache.GetDataAsync<IEnumerable<MessageRecord>>(FormatKey(culture)) ??
        Enumerable.Empty<MessageRecord>();
    }

    public async Task<IEnumerable<MessageRecord>> GetMessagesAsync(string? type,
      CultureInfo? culture = null)
    {
      var messages = await GetMessagesAsync(culture);
      if (type is null)
        return messages;

      return messages.Where(message => message.Type == type);
    }

    public async Task<MessageRecord?> GetMessageAsync(string type,
      int? code = null,
      CultureInfo? culture = null)
    {
      var messages = await GetMessagesAsync(type,
        culture);
      if (code is null)
        return messages.First();

      return messages.First(message => message.Code == code);
    }

    protected string FormatKey(CultureInfo? culture = null)
    {
      culture ??= new CultureInfo(DefaultConfiguration.DefaultCulture);
      return $"{CacheKeys.Messages}{Literals.FieldSeparator}{culture.Name}";
    }
  }
}
