namespace OpenSystem.Core.Domain.ResultCodes
{
  [Serializable]
  public class ListQueryResult<TData>
  : QueryResult<IList<TData>>
  {
    public int PageSize { get; set; }

    public int PageNumber { get; set; }

    public int RecordsFiltered { get; set; } = 0;

    public int RecordsTotal { get; set; } = 0;

    public int TotalPages => (int)Math.Ceiling(RecordsTotal / (double)PageSize);

    public bool HasPreviousPage => PageNumber > 1;

    public bool HasNextPage => PageNumber < TotalPages;

    public static ListQueryResult<TData> Success(IList<TData> data,
      int recordsTotal = 0,
      int pageSize = 0,
      int pageNumber = 1)
    {
      return new ListQueryResult<TData>(data,
        recordsTotal,
        pageSize,
        pageNumber);
    }

    public static new ListQueryResult<TData> Failure(Type resultCodeType,
      int code,
      string? detail = null)
    {
      return new ListQueryResult<TData>(resultCodeType,
        code,
        detail);
    }


    protected ListQueryResult(IList<TData>? data,
      int recordsTotal = 0,
      int pageSize = 0,
      int pageNumber = 1)
      : base(data)
    {
      if (data == null)
        data = new List<TData>();

      PageSize = pageSize;
      PageNumber = pageNumber;
      RecordsFiltered = data.Count;
      RecordsTotal = recordsTotal > 0
        ? data.Count
        : recordsTotal;
    }

    protected ListQueryResult(Type resultCodeType,
      int code,
      string? detail = null)
      : base(resultCodeType,
        code,
        detail)
    {
    }

    public static implicit operator ListQueryResult<TData>(QueryResult result) => (ListQueryResult<TData>)(result.Failed
      ? ListQueryResult<TData>.Failure(result.ResultCodeType,
        result.Code,
        result.Detail)
      : ListQueryResult<TData>.Success((IList<TData>)result.Data));

    public static implicit operator ListQueryResult(ListQueryResult<TData> result) => (ListQueryResult)(result.Failed
      ? ListQueryResult.Failure(result.ResultCodeType,
        result.Code,
        result.Detail)
      : ListQueryResult.Success((IList<object>)result.Data));

    public static explicit operator ListQueryResult<TData>(QueryResult<object> result) => (ListQueryResult<TData>)(result.Failed
      ? ListQueryResult<TData>.Failure(result.ResultCodeType,
        result.Code,
        result.Detail)
      : ListQueryResult<TData>.Success((IList<TData>)result.Data));
  }

  [Serializable]
  public class ListQueryResult
    : ListQueryResult<object>
  {
    public static new ListQueryResult<object> Failure(Type resultCodeType,
      int code,
      string? detail = null)
    {
      return new ListQueryResult(resultCodeType,
        code,
        detail);
    }

    protected ListQueryResult(Type resultCodeType,
      int code,
      string? detail = null)
      : base(resultCodeType,
        code,
        detail)
    {
    }
  }
}
