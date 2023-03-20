using System.Diagnostics;
using System.Reflection;
using System.Runtime.Serialization;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.ResultCodes
{
    [Serializable]
    public class Result<TData>
      : BaseResult, IResult<TData>
    {
      public TData? Data { get; set; }

      public static Result<TData> Success(TData? data)
      {
        return new Result<TData>();
      }

      public static Result<TData> Success(TData data,
        string? message = null)
      {
        return new Result<TData>(data,
          message);
      }

      public static Result<TData> Failure(Type resultCodeType,
        int code,
        List<string>? detail = null)
      {
        return new Result<TData>(resultCodeType,
          code,
          detail != null ?
            string.Join("\r\n", detail)
            : null);
      }

      public static Result<TData> Failure(Type resultCodeType,
        int code,
        string detail)
      {
        return new Result<TData>(resultCodeType,
          code,
          detail);
      }

      public static Result<TData> Failure(string resultCodeType,
        int code,
        List<string>? detail = null)
      {
        return new Result<TData>(resultCodeType,
          code,
         detail != null ?
            string.Join("\r\n",
              detail)
            : null);
      }

      public static Result<TData> Failure(string resultCodeType,
        int code,
        string detail)
      {
        return new Result<TData>(resultCodeType,
          code,
          detail);
      }

      public static Result<TData> Failure(Exception exception)
      {
        return new Result<TData>(exception);
      }

      protected Result()
        : base()
      {
        Succeeded = true;
      }

      protected Result(TData? data,
        string? message = null)
        : base(message)
      {
          Data = data;
      }

      protected Result(Type resultCodeType,
        int code,
        string? detail = null)
        : base(resultCodeType.FullName,
          code,
          detail)
      {
      }

      protected Result(string resultCodeType,
        int code,
        string? detail = null)
        : base(resultCodeType,
          code,
          detail)
      {
      }

    protected Result(Exception exception)
      : base(exception)
    {
    }

    protected override void InnerGetObjectData(SerializationInfo info,
      StreamingContext context)
    {
      base.InnerGetObjectData(info,
        context);

      if (Data != null)
        info.AddValue("Data",
          Data);
    }

    public static bool operator ==(Result<TData> a,
      Result<object> b)
    {
      if (a is null &&
        b is null)
          return true;

      if (a is null ||
        b is null ||
        (a.Failed != b.Failed))
          return false;

      if (a.Failed && b.Failed &&
        (a.ResultCodeType != b.ResultCodeType ||
          a.Code != b.Code ||
          string.Equals(a.Detail,
            b.Detail,
            StringComparison.OrdinalIgnoreCase)))
        return false;

      if (a.Succeeded && b.Succeeded &&
        ((a.Data is null && b.Data != null) ||
         (b.Data is null && a.Data != null) ||
         a.Data != null && !a.Data.Equals(b.Data)))
        return false;

      return true;
    }

    public static bool operator !=(Result<TData> a,
      Result<object> b)
    {
        return !(a == b);
    }

    public static implicit operator Result<TData>(Result result) => result.Failed
      ? Result<TData>.Failure(result.ResultCodeType,
        result.Code,
        result.Detail)
      : Result<TData>.Success((TData)result.Data,
        result.Message);

    public static implicit operator Result(Result<TData> result) => result.Failed
      ? Result.Failure(result.ResultCodeType,
        result.Code,
        result.Detail)
      : Result.Success(result.Data,
        result.Message);

    public override bool Equals(object? obj)
    {
      if (ReferenceEquals(this,
        obj))
        return true;
      if (!(obj is BaseResult baseResult) ||
        ReferenceEquals(obj,
        null))
        return false;

      return this == baseResult;
    }
  }

  [Serializable]
  public class Result : Result<object>
  {
    public static new Result Success()
    {
      return new Result();
    }

    public static new Result Success(object? data,
      string? message = null)
    {
      return new Result(data,
        message);
    }

    public static new Result Failure(Type resultCodeType,
      int code,
      string? detail = null)
    {
      return new Result(resultCodeType,
        code,
        detail);
    }

    public static new Result Failure(Exception exception)
    {
      return new Result(exception);
    }

    protected Result()
      : base()
    {
    }

    protected Result(object? data,
      string? message = null)
      : base(data,
        message)
    {
    }

    protected Result(Type resultCodeType,
      int code,
      string? detail = null)
      : base(resultCodeType,
        code,
        detail)
    {
    }

    protected Result(Exception exception)
      : base(exception)
    {
    }
  }
}
