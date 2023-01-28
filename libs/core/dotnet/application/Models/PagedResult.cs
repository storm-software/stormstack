using Microsoft.EntityFrameworkCore;
using OpenSystem.Core.DotNet.Application.Models.Parameters;
using OpenSystem.Core.DotNet.Domain.ResultCodes;

namespace OpenSystem.Core.DotNet.Application.Models
{
    [Serializable]
    public class PagedResult<T> : Result
    {
        public new List<T> Data { get; set; }

        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public int RecordsFiltered { get; set; }

        /// <summary>
        /// The total number of records in the database.
        /// </summary>
        public int RecordsTotal { get; set; }

        public int TotalPages => (int)Math.Ceiling(RecordsTotal / (double)PageSize);

        public bool HasPreviousPage => PageNumber > 1;

        public bool HasNextPage => PageNumber < TotalPages;

        public PagedResult(List<T> data,
          int pageNumber,
          int pageSize,
          RecordsCount recordsCount)
          : base(data)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
            this.RecordsFiltered = recordsCount.RecordsFiltered;
            this.RecordsTotal = recordsCount.RecordsTotal;
        }

        public static async Task<PagedResult<T>> CreateAsync(IQueryable<T> source,
          int pageNumber,
          int pageSize)
        {
            var count = await source.CountAsync();
            var data = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PagedResult<T>(data,
                pageNumber,
              count,
              new RecordsCount(0,
                count));
        }
    }
}
