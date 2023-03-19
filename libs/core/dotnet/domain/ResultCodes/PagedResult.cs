namespace OpenSystem.Core.Domain.ResultCodes
{
  [Serializable]
  public class PagedResult<TData>
  : Result<IList<TData>>
  {
    public int RecordsFiltered { get; set; } = 0;

    public int RecordsTotal { get; set; } = 0;

    public static PagedResult<TData> Success(IList<TData> data,
      int recordsTotal = 0)
    {
      return new PagedResult<TData>(data,
        recordsTotal);
    }

    protected PagedResult(IList<TData>? data,
      int recordsTotal = 0)
      : base(data)
    {
      if (data == null)
        data = new List<TData>();

      RecordsFiltered = data.Count;
      RecordsTotal = recordsTotal > 0
        ? data.Count
        : recordsTotal;
    }
  }
}
