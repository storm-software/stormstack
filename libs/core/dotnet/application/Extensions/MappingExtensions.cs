using AutoMapper;
using AutoMapper.QueryableExtensions;
using OpenSystem.Core.DotNet.Application.Models;
using Microsoft.EntityFrameworkCore;

namespace OpenSystem.Core.DotNet.Application.Extensions
{
  public static class MappingExtensions
  {
      public static Task<PagedResult<TDestination>> PagedResultAsync<TDestination>(this IQueryable<TDestination> queryable,
        int pageNumber,
        int pageSize)
        where TDestination : class
          => PagedResult<TDestination>.CreateAsync(queryable.AsNoTracking(),
            pageNumber,
            pageSize);

      public static Task<List<TDestination>> ProjectToListAsync<TDestination>(this IQueryable queryable,
        IConfigurationProvider configuration)
        where TDestination : class
          => queryable.ProjectTo<TDestination>(configuration).AsNoTracking().ToListAsync();
  }
}
