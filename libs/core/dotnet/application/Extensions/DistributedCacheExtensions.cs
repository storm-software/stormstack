using System.Globalization;
using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;
using OpenSystem.Core.Domain.Constants;
using OpenSystem.Core.Domain.Entities;
using AutoMapper;
using OpenSystem.Core.Application.Models.DTOs;

namespace OpenSystem.Core.Application.Extensions
{
    public static class DistributedCacheExtensions
    {
        public static async Task SetDataAsync<TData>(this IDistributedCache cache,
          string key,
          TData data,
          TimeSpan? expirationTime = null)
        {
          await cache.SetStringAsync(key,
            JsonSerializer.Serialize<TData>(data),
            new DistributedCacheEntryOptions {
              SlidingExpiration = expirationTime
            });
        }

        public static async Task<TData?> GetDataAsync<TData>(this IDistributedCache cache,
          string key)
        {
            var data = await cache.GetStringAsync(key);
            if (data is null)
                return default(TData);

            return JsonSerializer.Deserialize<TData>(data);
        }
    }
}
