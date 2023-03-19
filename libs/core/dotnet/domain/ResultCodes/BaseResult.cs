using System.Diagnostics;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;
using MediatR;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.ResultCodes
{
    [Serializable]
    public class BaseResult
      : ISerializable, IBaseResult
    {
      public int Code { get; set; } = 0;

      public string ResultCodeType { get; set; } = typeof(ResultCodeGeneral).FullName;

      public bool Succeeded { get; set; }

      public bool Failed => !Succeeded;

      public string? Message { get; set; }

      public string? Detail { get; set; }

      public string? HelpLink { get; set; }

      public string? StackTrace { get; set; }

      protected BaseResult()
      {
        Succeeded = true;
      }

      protected BaseResult(string? message = null)
      {
          Succeeded = true;
          Message = message;
      }

      protected BaseResult(Type resultCodeType,
        int code,
        string? detail = null)
      {
          Succeeded = false;
          ResultCodeType = resultCodeType.FullName;
          Code = code;
          Message = ResultCode.Serialize(resultCodeType,
            code);
          Detail = detail;
          StackTrace = GetStackTrace();
      }

      protected BaseResult(string resultCodeType,
        int code,
        string? detail = null)
      {
          Succeeded = false;
          ResultCodeType = resultCodeType;
          Code = code;
          Message = ResultCode.Serialize(resultCodeType,
            code);
          Detail = detail;
          StackTrace = GetStackTrace();
      }

    protected BaseResult(Exception exception)
    {
        Succeeded = false;
        Message = exception.Message;

        if (!string.IsNullOrEmpty(exception.InnerException?.Message))
          Detail = exception.InnerException.Message;

        HelpLink = exception.HelpLink;
        StackTrace = !string.IsNullOrEmpty(exception.StackTrace)
          ? exception.StackTrace
          : GetStackTrace();
    }

    public void GetObjectData(SerializationInfo info,
      StreamingContext context)
    {
        info.AddValue("Failed",
          Failed);
        info.AddValue("Succeeded",
          Succeeded);
        info.AddValue("Message",
          Message);

        if (Failed)
        {
          info.AddValue("Detail",
            Detail);
          info.AddValue("HelpLink",
            HelpLink);
          info.AddValue("StackTrace",
            StackTrace);
        }

        InnerGetObjectData(info,
          context);
    }

    protected virtual void InnerGetObjectData(SerializationInfo info,
      StreamingContext context)
    {
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

    public static bool operator ==(BaseResult a,
      BaseResult b)
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

      return true;
    }

    public static bool operator !=(BaseResult a,
      BaseResult b)
    {
        return !(a == b);
    }
  }
}
