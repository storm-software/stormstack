using OpenSystem.Core.DotNet.Application.Models.Parameters;

namespace OpenSystem.Core.DotNet.Application.Models
{
    [Serializable]
    public class PagedResult<T> : Result<T>
    {
        public virtual int PageNumber { get; set; }

        public int PageSize { get; set; }

        public int RecordsFiltered { get; set; }

        public int RecordsTotal { get; set; }

        public PagedResult(T data,
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
    }
}
