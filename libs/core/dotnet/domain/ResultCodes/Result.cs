using System.Diagnostics;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.ResultCodes
{
    [Serializable]
    public class Result : ISerializable, IResult<object>
    {
      public int? Code { get; set; }

      public Type? ResultCodeType { get; set; }

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
        List<string>? details = null)
      {

        return new Result(resultCodeType,
          code,
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
  }
}
