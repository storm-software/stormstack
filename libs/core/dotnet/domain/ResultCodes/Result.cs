using System.Diagnostics;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Core.Domain.ResultCodes
{
    [Serializable]
    public class Result<TData>
      : BaseResult, IResult<TData>
    {
      public TData? Data { get; set; }

      public string? HelpLink { get; set; }

      public string? StackTrace { get; set; }

      public IList<FieldValidationResult> Fields { get; init; } = new List<FieldValidationResult>();

      public static Result<TData> Success() => new Result<TData>(typeof(ResultCodeGeneral)?.FullName,
        ResultCodeGeneral.NoErrorOccurred);

      public static Result<TData> Success(TData? data,
        string? detail = null,
        string? extendedDetail = null,
        ResultSeverityTypes severity = ResultSeverityTypes.None,
        string? helpLink = null,
        Dictionary<string, object>? formattedMessagePlaceholderValues = null)
      {
          return new Result<TData>(data,
            detail != null ?
              string.Join("\r\n", detail)
              : null,
            extendedDetail,
              severity,
              helpLink,
              formattedMessagePlaceholderValues);
      }

      public static Result<TData> Failure(Type type,
        int code,
        string? detail = null,
        string? extendedDetail = null,
        ResultSeverityTypes severity = ResultSeverityTypes.Error,
        string? helpLink = null,
        IList<FieldValidationResult>? fields = null,
        Dictionary<string, object>? formattedMessagePlaceholderValues = null)
      {
          return new Result<TData>(type,
            code,
            detail,
            extendedDetail,
            severity,
            helpLink,
            fields,
            formattedMessagePlaceholderValues);
      }

      public static Result<TData> Failure(string type,
        int code,
        string? detail = null,
        string? extendedDetail = null,
        ResultSeverityTypes severity = ResultSeverityTypes.Error,
        string? helpLink = null,
        Dictionary<string, object>? formattedMessagePlaceholderValues = null)
      {
          return new Result<TData>(type,
            code,
            detail,
            extendedDetail,
            severity,
            helpLink,
            formattedMessagePlaceholderValues);
      }

      public static Result<TData> Failure(Exception exception,
        ResultSeverityTypes severity = ResultSeverityTypes.Error,
        Type? type = null,
        int? code = null)
      {
        return new Result<TData>(exception,
        severity);
      }

      protected Result()
        : base(ResultSeverityTypes.None)
      {
        StackTrace = GetStackTrace();
      }

      protected Result(TData? data,
        string? detail = null,
        string? extendedDetail = null,
        ResultSeverityTypes severity = ResultSeverityTypes.None,
        string? helpLink = null,
        Dictionary<string, object>? formattedMessagePlaceholderValues = null)
        : base(typeof(ResultCodeGeneral)?.FullName,
          ResultCodeGeneral.NoErrorOccurred,
          detail,
          extendedDetail,
          severity,
          formattedMessagePlaceholderValues)
      {
          Data = data;
          HelpLink = helpLink;
          StackTrace = GetStackTrace();
      }

      protected Result(Type type,
        int code,
        string? detail = null,
        string? extendedDetail = null,
        ResultSeverityTypes severity = ResultSeverityTypes.Error,
        string? helpLink = null,
        IList<FieldValidationResult>? fields = null,
        Dictionary<string, object>? formattedMessagePlaceholderValues = null)
        : base(type?.FullName,
          code,
          detail,
          extendedDetail,
          severity,
          formattedMessagePlaceholderValues)
      {
          if (fields != null)
            Fields = fields;

          HelpLink = helpLink;
          StackTrace = GetStackTrace();
      }

      protected Result(string type,
        int code,
        string? detail = null,
        string? extendedDetail = null,
        ResultSeverityTypes severity = ResultSeverityTypes.Error,
        string? helpLink = null,
        Dictionary<string, object>? formattedMessagePlaceholderValues = null)
        : base(type,
            code,
            detail,
            extendedDetail,
            severity,
            formattedMessagePlaceholderValues)
      {
          HelpLink = helpLink;
          StackTrace = GetStackTrace();
      }


      protected Result(Exception exception,
        ResultSeverityTypes severity = ResultSeverityTypes.Error,
          Type? type = null,
          int? code = null)
        : base(exception,
          severity,
          type,
          code)
      {
          HelpLink = exception.HelpLink;
          StackTrace = !string.IsNullOrEmpty(exception.StackTrace)
            ? exception.StackTrace
            : GetStackTrace();
      }

      public FieldValidationResult AddField(string fieldName,
        Type type,
        int code,
        object? attemptedValue,
        ResultSeverityTypes severity = ResultSeverityTypes.Error,
        string? detail = null,
        string? extendedDetail = null,
        Dictionary<string, object>? formattedMessagePlaceholderValues = null)
      {
        var field = FieldValidationResult.Failure(fieldName,
          type,
          code,
          attemptedValue,
          severity,
          detail,
          extendedDetail,
          formattedMessagePlaceholderValues);

        Fields.Add(field);
        return field;
      }

      protected override void InnerGetObjectData(ref SerializationInfo info,
        StreamingContext context)
      {
        base.InnerGetObjectData(ref info,
          context);

        if (Data != null)
          info.AddValue("Data",
            Data);
        if (Fields != null &&
          Fields.Count > 0)
          info.AddValue("Fields",
            Fields);

        info.AddValue("HelpLink",
            HelpLink);

        if (Failed)
          info.AddValue("StackTrace",
            StackTrace);
      }

      private string GetStackTrace()
      {
        lock (typeof(BaseResult))
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

    public static implicit operator Result<TData>(Result result) => result.Failed
      ? Result<TData>.Failure(result.Type,
        result.Code,
        result.Detail)
      : Result<TData>.Success((TData)result.Data,
        result.Detail);

    public static implicit operator Result(Result<TData> result) => result.Failed
      ? Result.Failure(result.Type,
        result.Code,
        result.Detail)
      : Result.Success(result.Data,
        result.Detail);

    public override bool Equals(object? obj)
    {
      if (ReferenceEquals(obj,
        null) ||
        !(obj is BaseResult baseResult))
        return false;

      return base.Equals(baseResult);
    }

    public override int GetHashCode()
    {
      return base.GetHashCode() + (HelpLink + StackTrace).GetHashCode();
    }
  }

  [Serializable]
  public class Result
    : Result<object>
  {
    public static new Result Success(object? data = null,
        string? detail = null,
        string? extendedDetail = null,
        ResultSeverityTypes severity = ResultSeverityTypes.None,
        string? helpLink = null,
        Dictionary<string, object>? formattedMessagePlaceholderValues = null)
    {
      return new Result(data,
          detail,
          extendedDetail,
          severity,
          helpLink,
          formattedMessagePlaceholderValues);
    }

    public static new Result Failure(Type type,
        int code,
        string? detail = null,
        string? extendedDetail = null,
        ResultSeverityTypes severity = ResultSeverityTypes.Error,
        string? helpLink = null,
        IList<FieldValidationResult>? fields = null,
        Dictionary<string, object>? formattedMessagePlaceholderValues = null)
    {
      return new Result(type,
          code,
          detail,
          extendedDetail,
          severity,
          helpLink,
          fields,
          formattedMessagePlaceholderValues);
    }

    public static Result Failure(Type type,
      Exception exception,
      ResultSeverityTypes severity = ResultSeverityTypes.Error)
    {
      return new Result(exception,
        severity);
    }

    protected Result(object? data,
        string? detail = null,
        string? extendedDetail = null,
        ResultSeverityTypes severity = ResultSeverityTypes.None,
        string? helpLink = null,
        Dictionary<string, object>? formattedMessagePlaceholderValues = null)
      : base(data,
          detail,
          extendedDetail,
          severity,
          helpLink,
          formattedMessagePlaceholderValues)
    {
    }

    protected Result(Type type,
        int code,
        string? detail = null,
        string? extendedDetail = null,
        ResultSeverityTypes severity = ResultSeverityTypes.Error,
        string? helpLink = null,
        IList<FieldValidationResult>? fields = null,
        Dictionary<string, object>? formattedMessagePlaceholderValues = null)
        : base(type,
          code,
          detail,
          extendedDetail,
          severity,
          helpLink,
          fields,
          formattedMessagePlaceholderValues)
    {
    }

    protected Result(Exception exception,
      ResultSeverityTypes severity = ResultSeverityTypes.Error)
      : base(exception,
        severity)
    {
    }
  }
}
