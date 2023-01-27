using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;
using OpenSystem.Core.DotNet.Application.Models.Parameters;

namespace OpenSystem.Core.DotNet.Application.Models
{
    [Serializable]
    public class Result<T> : ISerializable
    {
      public bool Succeeded { get; set; }

      public bool Failed => !Succeeded;

      public string? Message { get; set; }

      public List<string>? Details { get; set; }

      public string? HelpLink { get; set; }

      public string? StackTrace { get; set; }

      public T? Data { get; set; }

      public static Result<object?> Success()
      {
        return new Result<object?>();
      }

      public static Result<TData> Success<TData>(TData data,
        string? message = null)
      {
        return new Result<TData>(data,
          message);
      }

      public static Result<TData> Fail<TData>(string message,
        string? details = null)
      {
        List<string>? detailsList = null;
        if (!string.IsNullOrEmpty(details))
        {
          detailsList = new List<string>();
          detailsList.Add(details);
        }

        return new Result<TData>(message,
          detailsList);
      }

        public static Result<TData> Fail<TData>(string message,
          List<string>? details)
      {
        return new Result<TData>(message,
          details);
      }

      public static Result<TData> Fail<TData>(Exception exception)
      {
        return new Result<TData>(exception);
      }

      protected Result()
      {
        Succeeded = true;
      }

      protected Result(T data,
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
      lock (typeof(Result<T>))
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
