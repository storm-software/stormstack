using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Application.Mappings
{
  public static class MappingExtensions
  {
      public static Task<Paged<TData>> ToPagedAsync<TData>(this IQueryable<TData> queryable,
        int pageNumber,
        int pageSize)
        where TData : class
          => Paged<TData>.CreateAsync(queryable.AsNoTracking(),
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
