using System.Diagnostics;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Core.Domain.ResultCodes
{
    [Serializable]
    public class BaseResult : ISerializable, IBaseResult
    {
        public string Type { get; set; } = typeof(ResultCodeGeneral).FullName;

        public int Code { get; set; } = ResultCodeGeneral.GeneralError;

        public ResultSeverityTypes Severity { get; set; } = ResultSeverityTypes.None;

        public bool Succeeded => Severity >= ResultSeverityTypes.Warning;

        public bool Failed => !Succeeded;

        public string? Detail { get; set; }

        public string? ExtendedDetail { get; set; }

        public string? StackTrace { get; set; }

        public Dictionary<string, object>? FormattedMessagePlaceholderValues { get; init; }

        protected BaseResult(ResultSeverityTypes severity = ResultSeverityTypes.None)
        {
            Severity = severity;

            if (Succeeded)
            {
                Type = typeof(ResultCodeGeneral).FullName;
                Code = ResultCodeGeneral.NoErrorOccurred;
            }
        }

        protected BaseResult(
            string? detail = null,
            string? extendedDetail = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error
        )
        {
            Detail = detail;
            ExtendedDetail = extendedDetail;
            Severity = severity;

            if (Succeeded)
            {
                Type = typeof(ResultCodeGeneral).FullName;
                Code = ResultCodeGeneral.NoErrorOccurred;
            }
        }

        protected BaseResult(
            Type type,
            int code,
            string? detail = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error
        )
        {
            Type = type?.FullName;
            Code = code;
            Severity = severity;
            Detail = detail;
        }

        protected BaseResult(
            Type type,
            int code,
            string? detail = null,
            string? extendedDetail = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error
        )
        {
            Type = type?.FullName;
            Code = code;
            Severity = severity;
            Detail = detail;
            ExtendedDetail = extendedDetail;
        }

        protected BaseResult(
            string type,
            int code,
            string? detail = null,
            string? extendedDetail = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null
        )
        {
            Type = type;
            Code = code;
            Severity = severity;
            Detail = detail;
            ExtendedDetail = extendedDetail;
            FormattedMessagePlaceholderValues = formattedMessagePlaceholderValues;
        }

        protected BaseResult(
            Exception exception,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            Type? type = null,
            int? code = null
        )
        {
            Detail = exception.Message;
            Severity = severity;
            Type = type != null ? type.FullName : typeof(ResultCodeGeneral).FullName;
            Code = code ?? ResultCodeGeneral.NoErrorOccurred;

            if (!string.IsNullOrEmpty(exception.InnerException?.Message))
                ExtendedDetail = exception.InnerException.Message;
        }

        public void SetResultCodeType(Type type)
        {
            if (type.FullName != null)
                Type = type.FullName;
        }

        public void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("Code", Code);
            info.AddValue("Type", Type);
            info.AddValue("Severity", Severity);
            info.AddValue("Succeeded", Succeeded);
            info.AddValue("Failed", Failed);
            info.AddValue("Detail", Detail);
            info.AddValue("ExtendedDetail", ExtendedDetail);
            info.AddValue("FormattedMessagePlaceholderValues", FormattedMessagePlaceholderValues);

            if (Failed)
                info.AddValue("StackTrace", StackTrace);

            InnerGetObjectData(ref info, context);
        }

        protected virtual void InnerGetObjectData(
            ref SerializationInfo info,
            StreamingContext context
        ) { }

        public static bool operator ==(BaseResult? a, BaseResult? b)
        {
            if (a is null && b is null)
                return true;
            if (a != null || b != null)
                return false;
            return a.Equals(b);
        }

        public static bool operator !=(BaseResult? a, BaseResult? b)
        {
            return !(a == b);
        }

        public override bool Equals(object? obj)
        {
            if (ReferenceEquals(this, obj))
                return true;
            if (
                ReferenceEquals(obj, null)
                || !(obj is BaseResult baseResult)
                || Failed != baseResult.Failed
                || Type != baseResult.Type
                || Code != baseResult.Code
                || Severity != baseResult.Severity
                || !string.Equals(
                    baseResult.Detail,
                    baseResult.Detail,
                    StringComparison.OrdinalIgnoreCase
                )
                || !string.Equals(
                    baseResult.ExtendedDetail,
                    baseResult.ExtendedDetail,
                    StringComparison.OrdinalIgnoreCase
                )
            )
                return false;

            return true;
        }

        public override int GetHashCode()
        {
            return (Code.ToString() + Type).GetHashCode();
        }

        protected string GetStackTrace()
        {
            lock (typeof(BaseResult))
            {
                EnhancedStackTrace stackFrames = EnhancedStackTrace.Current();
                if (stackFrames == null)
                    return "";

                StringBuilder stackTrace = new StringBuilder();
                foreach (EnhancedStackFrame stackFrame in stackFrames.GetFrames())
                {
                    if (stackFrame == null)
                        continue;

                    MethodBase? methodBase = stackFrame.GetMethod();
                    if (methodBase == null)
                        continue;

                    Type? type = methodBase.DeclaringType;
                    if (type == null)
                        continue;

                    stackTrace.AppendFormat(
                        "   at {0}.{1}.{2}(...) [line {3}]\r\n",
                        type.Namespace,
                        type.Name,
                        methodBase.Name,
                        stackFrame.GetFileLineNumber()
                    );
                }

                return stackTrace.ToString();
            }
        }
    }
}
