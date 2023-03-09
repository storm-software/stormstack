using System.Diagnostics;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;
using MediatR;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.ResultCodes
{
    [Serializable]
    public class Result<TData>
      : ISerializable, IResult<TData>
    {
      public int Code { get; set; } = 0;

      public Type ResultCodeType { get; set; } = typeof(ResultCodeGeneral);

      public bool Succeeded { get; set; }

      public bool Failed => !Succeeded;

      public string? Message { get; set; }

      public List<string>? Details { get; set; }

      public string? HelpLink { get; set; }

      public string? StackTrace { get; set; }

      public TData? Data { get; set; }

      public static Result<TData> Success()
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
        List<string>? details = null)
      {

        return new Result<TData>(resultCodeType,
          code,
          details);
      }

      public static Result<TData> Failure(Exception exception)
      {
        return new Result<TData>(exception);
      }

      protected Result()
      {
        Succeeded = true;
      }

      protected Result(TData? data,
        string? message = null)
      {
          Succeeded = true;
          Message = message;
          Data = data;
      }

      protected Result(Type resultCodeType,
        int code,
        List<string>? details = null)
      {
          Succeeded = false;
          ResultCodeType = resultCodeType;
          Code = code;
          Message = ResultCode.Serialize(resultCodeType,
            code);
          Details = details;
          StackTrace = GetStackTrace();
      }

    protected Result(Exception exception)
    {
        Succeeded = false;
        Message = exception.Message;

        if (!string.IsNullOrEmpty(exception.InnerException?.Message))
        {
          Details = new List<string>();
          Details.Add(exception.InnerException.Message);
        }

        HelpLink = exception.HelpLink;
        StackTrace = !string.IsNullOrEmpty(exception.StackTrace)
          ? exception.StackTrace
          : GetStackTrace();
    }

    public void GetObjectData(SerializationInfo info,
      StreamingContext context)
    {
        info.AddValue("Failed", Failed);
        info.AddValue("Succeeded", Succeeded);
        info.AddValue("Message", Message);

        if (Failed)
        {
          info.AddValue("Details", Details);
          info.AddValue("HelpLink", HelpLink);
          info.AddValue("StackTrace", StackTrace);
        }

        if (Data != null)
          info.AddValue("Data", Data);
    }

    private string GetStackTrace()
		{
      lock (typeof(Result))
      {
        StringBuilder sbStackTrace = new StringBuilder();

        StackTrace stCallRelative = new StackTrace(4,
          false);
        if (stCallRelative == null)
          return "";

        for (int i = 0; i < stCallRelative.FrameCount; i++)
        {
          StackFrame? sfFrame = stCallRelative.GetFrame(i);
          if (sfFrame == null)
            continue;

          MethodBase? mbFrame = sfFrame.GetMethod();
          if (mbFrame == null)
            continue;

          Type? typeDeclaring = mbFrame.DeclaringType;
          if (typeDeclaring == null)
            continue;

          sbStackTrace.AppendFormat("   at {0}.{1}.{2}(...)\r\n",
            typeDeclaring.Namespace,
            typeDeclaring.Name,
            mbFrame.Name);
        }

        return sbStackTrace.ToString();
      }
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
          ((a.Details is null && b.Details != null) ||
          (b.Details is null && a.Details != null) ||
          a.Details != null && !a.Details.Equals(b.Details))))
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
        result.Details)
      : Result<TData>.Success((TData)result.Data,
        result.Message);

    public static implicit operator Result(Result<TData> result) => result.Failed
      ? Result.Failure(result.ResultCodeType,
        result.Code,
        result.Details)
      : Result.Success(result.Data,
        result.Message);
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
      List<string>? details = null)
    {

      return new Result(resultCodeType,
        code,
        details);
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
      : base(data, message)
    {
    }

    protected Result(Type resultCodeType,
      int code,
      List<string>? details = null)
      : base(resultCodeType,
        code,
        details)
    {
    }

    protected Result(Exception exception)
      : base(exception)
    {
    }
  }
}
