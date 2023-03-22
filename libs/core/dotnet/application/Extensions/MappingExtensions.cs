using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Application.Extensions
{
  public static class MappingExtensions
  {
      public static Task<Paged<TDestination>> PagedResultAsync<TDestination>(this IQueryable<TDestination> queryable,
        int pageNumber,
        int pageSize)
        where TDestination : class
          => Paged<TDestination>.CreateAsync(queryable.AsNoTracking(),
            pageNumber,
            pageSize);

      public static Task<List<TDestination>> ProjectToListAsync<TDestination>(this IQueryable queryable,
        IConfigurationProvider configuration)
        where TDestination : class
          => queryable
          .ProjectTo<TDestination>(configuration)
          .AsNoTracking()
          .ToListAsync();
  }
}
