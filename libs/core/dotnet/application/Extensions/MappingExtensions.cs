using AutoMapper;
using AutoMapper.QueryableExtensions;
using OpenSystem.Core.Application.Models;
using Microsoft.EntityFrameworkCore;

namespace OpenSystem.Core.Application.Extensions
{
  public static class MappingExtensions
  {
      public static Task<PagedResponse<TDestination>> PagedResultAsync<TDestination>(this IQueryable<TDestination> queryable,
        int pageNumber,
        int pageSize)
        where TDestination : class
          => PagedResponse<TDestination>.CreateAsync(queryable.AsNoTracking(),
            pageNumber,
            pageSize);

      public static Task<List<TDestination>> ProjectToListAsync<TDestination>(this IQueryable queryable,
        IConfigurationProvider configuration)
        where TDestination : class
          => queryable.ProjectTo<TDestination>(configuration).AsNoTracking().ToListAsync();
  }
}
