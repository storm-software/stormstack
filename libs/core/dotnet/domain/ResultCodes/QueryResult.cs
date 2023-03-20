namespace OpenSystem.Core.Domain.ResultCodes
{
  [Serializable]
  public class QueryResult<TData>
  : Result<TData>
  {
    public static new QueryResult<TData> Failure(Type resultCodeType,
      int code,
      string? detail = null)
    {
      return new QueryResult<TData>(resultCodeType,
        code,
        detail);
    }

    public static new QueryResult<TData> Failure(string resultCodeType,
      int code,
      string? detail = null)
    {
      return new QueryResult<TData>(resultCodeType,
        code,
        detail);
    }


    public static new QueryResult<TData> Success(TData data,
        string? message = null)
    {
      return new QueryResult<TData>(data,
        message);
    }

    protected QueryResult(Type resultCodeType,
      int code,
      string? detail = null)
      : base(resultCodeType,
        code,
        detail)
    {
    }

    protected QueryResult(string resultCodeType,
      int code,
      string? detail = null)
      : base(resultCodeType,
        code,
        detail)
    {
    }

    protected QueryResult(TData? data,
      string? message = null)
      : base(data,
        message)
    {
    }

    public static implicit operator QueryResult<TData>(QueryResult result) => result.Failed
      ? QueryResult<TData>.Failure(result.ResultCodeType,
        result.Code,
        result.Detail)
      : QueryResult<TData>.Success((TData)result.Data,
        result.Message);

    public static implicit operator QueryResult(QueryResult<TData> result) => result.Failed
      ? QueryResult.Failure(result.ResultCodeType,
        result.Code,
        result.Detail)
      : QueryResult.Success(result.Data,
        result.Message);
  }

  [Serializable]
  public class QueryResult
    : QueryResult<object>
  {
    public static new QueryResult<object> Failure(Type resultCodeType,
      int code,
      string detail)
    {
      return new QueryResult(resultCodeType,
        code,
        detail);
    }

    public static new QueryResult Failure(string resultCodeType,
      int code,
      string? detail = null)
    {
      return new QueryResult(resultCodeType,
        code,
        detail);
    }

    protected QueryResult(Type resultCodeType,
      int code,
      string? detail = null)
      : base(resultCodeType,
        code,
        detail)
    {
    }

    protected QueryResult(string resultCodeType,
      int code,
      string? detail = null)
      : base(resultCodeType,
        code,
        detail)
    {
    }
  }
}
