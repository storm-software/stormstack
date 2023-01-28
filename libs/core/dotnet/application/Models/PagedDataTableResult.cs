using OpenSystem.Core.DotNet.Application.Models.Parameters;
using OpenSystem.Core.DotNet.Domain.ResultCodes;

namespace OpenSystem.Core.DotNet.Application.Models
{
    [Serializable]
    public class PagedDataTableResult : Result
    {
        public int Draw { get; set; }

        public int RecordsFiltered { get; set; }

        public int RecordsTotal { get; set; }

        public bool IsActive { get; set; }

        public PagedDataTableResult(object data,
          int pageNumber,
          RecordsCount recordsCount)
          : base(data)
        {
            this.Draw = pageNumber;
            this.RecordsFiltered = recordsCount.RecordsFiltered;
            this.RecordsTotal = recordsCount.RecordsTotal;
            this.IsActive = true;
        }

        public PagedDataTableResult(object data,
          int pageNumber,
          RecordsCount recordsCount,
          bool isActive)
          : base(data)
        {
            this.Draw = pageNumber;
            this.RecordsFiltered = recordsCount.RecordsFiltered;
            this.RecordsTotal = recordsCount.RecordsTotal;
            this.IsActive = isActive;
        }
    }
}
