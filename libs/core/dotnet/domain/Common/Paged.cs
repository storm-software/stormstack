using Microsoft.EntityFrameworkCore;
using OpenSystem.Core.Domain.Constants;
using OpenSystem.Core.Domain.ResultCodes;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;
using System.Text.Json;

namespace OpenSystem.Core.Domain.Common
{
    [Serializable]
    public class Paged<TData>
    {
        public IList<TData> Data { get; set; }

        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        /// <summary>
        /// The number of records returned back in the query from the database.
        /// </summary>
        public int RecordsFiltered { get; set; }

        /// <summary>
        /// The total number of records in the database.
        /// </summary>
        public int RecordsTotal { get; set; }

        public int TotalPages => (int)Math.Ceiling(RecordsTotal / (double)PageSize);

        public bool HasPreviousPage => PageNumber > 1;

        public bool HasNextPage => PageNumber < TotalPages;

        public Paged(
            IList<TData> data,
            int? pageNumber = 1,
            int? pageSize = 0,
            int? recordsFiltered = 0,
            int? recordsTotal = 0
        )
        {
            Data = data;
            PageNumber = (int)(pageNumber != null ? pageNumber : 1);
            PageSize = (int)(
                pageSize != null ? pageSize : DefaultConfiguration.DefaultSearchPageSize
            );
            RecordsFiltered = (int)(recordsFiltered != null ? recordsFiltered : 0);
            RecordsTotal = (int)(recordsTotal != null ? recordsTotal : 0);
        }

        public static async Task<Paged<TData>> CreateAsync(
            IQueryable<TData> source,
            int? pageNumber = 1,
            int? pageSize = DefaultConfiguration.DefaultSearchPageSize,
            int? recordsFiltered = 0,
            int? recordsTotal = 0
        )
        {
            var count = await source.CountAsync();
            var results = await source
                .Skip(((pageNumber ?? 1) - 1) * (pageSize ?? 0))
                .Take(pageSize ?? DefaultConfiguration.DefaultSearchPageSize)
                .ToListAsync();

            return new Paged<TData>(results, pageNumber, count, 0, count);
        }

        public static implicit operator Paged<TData>(Paged paged) =>
            new Paged<TData>(
                (IList<TData>)paged.Data,
                paged.PageNumber,
                paged.PageSize,
                paged.RecordsFiltered,
                paged.RecordsTotal
            );

        public static implicit operator Paged(Paged<TData> paged) =>
            new Paged(
                (IList<object>)paged.Data,
                paged.PageNumber,
                paged.PageSize,
                paged.RecordsFiltered,
                paged.RecordsTotal
            );
    }

    [Serializable]
    public class Paged : Paged<object>
    {
        public Paged(
            IList<object> data,
            int? pageNumber,
            int? pageSize,
            int? recordsFiltered,
            int? recordsTotal
        )
            : base(data, pageNumber, pageSize, recordsFiltered, recordsTotal) { }

        public static async Task<Paged> CreateAsync(
            IQueryable<object> source,
            int? pageNumber,
            int? pageSize,
            int? recordsFiltered,
            int? recordsTotal
        )
        {
            return (Paged)
                await Paged.CreateAsync(
                    source,
                    pageNumber,
                    pageSize,
                    recordsFiltered,
                    recordsTotal
                );
        }
    }
}
