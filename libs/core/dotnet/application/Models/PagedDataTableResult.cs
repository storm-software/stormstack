using OpenSystem.Core.DotNet.Application.Models.Parameters;

namespace OpenSystem.Core.DotNet.Application.Models
{
    [Serializable]
    public class PagedDataTableResult<T> : Result<T>
    {
        public PagedDataTableResult(T data,
          int pageNumber,
          RecordsCount recordsCount)
          : base(data)
        {
            this.Draw = pageNumber;
            this.RecordsFiltered = recordsCount.RecordsFiltered;
            this.RecordsTotal = recordsCount.RecordsTotal;
        }

        public int Draw { get; set; }

        public int RecordsFiltered { get; set; }

        public int RecordsTotal { get; set; }
    }
}
