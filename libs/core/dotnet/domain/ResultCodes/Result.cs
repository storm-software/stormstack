using System.Diagnostics;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;

namespace OpenSystem.Core.Domain.ResultCodes
{
    [Serializable]
    public class Result : ISerializable, IResult<object>
    {
      public bool Succeeded { get; set; }

      public bool Failed => !Succeeded;

      public string? Message { get; set; }

      public List<string>? Details { get; set; }

      public string? HelpLink { get; set; }

      public string? StackTrace { get; set; }

      public object? Data { get; set; }

      public static Result Success()
      {
        return new Result();
      }

      public static Result Success(object data,
        string? message = null)
      {
        return new Result(data,
          message);
      }

      public static Result Failure(Type resultCodeType,
        int code,
        string? details = null)
      {
        List<string>? detailsList = null;
        if (!string.IsNullOrEmpty(details))
        {
          detailsList = new List<string>();
          detailsList.Add(details);
        }

        return Result.Failure(ResultCode.Serialize(resultCodeType,
          code),
          detailsList);
      }

      public static Result Failure(string message,
        string? details = null)
      {
        List<string>? detailsList = null;
        if (!string.IsNullOrEmpty(details))
        {
          detailsList = new List<string>();
          detailsList.Add(details);
        }

        return new Result(message,
          detailsList);
      }

      public static Result Failure(Type resultCodeType,
        int code,
        List<string>? details)
      {
        return Result.Failure(ResultCode.Serialize(resultCodeType,
          code),
          details);
      }

      public static Result Failure(string message,
          List<string>? details)
      {
        return new Result(message,
          details);
      }

      public static Result Failure(Exception exception)
      {
        return new Result(exception);
      }

      protected Result()
      {
        Succeeded = true;
      }

      protected Result(object data,
        string? message = null)
      {
          Succeeded = true;
          Message = message;
          Data = data;
      }

      protected Result(string message,
        List<string>? details = null)
      {
          Succeeded = false;
          Message = message;
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
  }
}
