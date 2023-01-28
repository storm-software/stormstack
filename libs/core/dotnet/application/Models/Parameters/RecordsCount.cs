namespace OpenSystem.Core.DotNet.Application.Models.Parameters
{
    public class RecordsCount
    {
        public int RecordsFiltered { get; set; }

        public int RecordsTotal { get; set; }

        public RecordsCount(int recordsFiltered,
          int recordsTotal)
        {
            RecordsFiltered = recordsFiltered;
            RecordsTotal = RecordsTotal;
        }
    }
}
