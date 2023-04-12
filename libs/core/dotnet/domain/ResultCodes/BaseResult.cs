using System.Diagnostics;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Constants;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Extensions;

namespace OpenSystem.Core.Domain.ResultCodes
{
    [Serializable]
    public class BaseResult : ISerializable, IBaseResult
    {
        public static bool operator ==(BaseResult? a, BaseResult? b)
        {
            if (a is null && b is null)
                return true;
            if (a is null || b is null)
                return false;
            return (a?.Equals(b) != true);
        }

        public static bool operator !=(BaseResult? a, BaseResult? b)
        {
            return !(a == b);
        }

        public string Type { get; set; } = typeof(ResultCodeGeneral).PrettyPrint();

        public int Code { get; set; } = ResultCodeGeneral.GeneralError;

        public ResultSeverityTypes Severity { get; set; } = ResultSeverityTypes.None;

        public bool Succeeded => Severity >= ResultSeverityTypes.Warning;

        public bool Failed => !Succeeded;

        public string? ExtendedMessage { get; set; }

        public string? StackTrace { get; set; }

        public Dictionary<string, object>? FormattedMessagePlaceholderValues { get; init; }

        protected BaseResult(ResultSeverityTypes severity = ResultSeverityTypes.None)
        {
            Severity = severity;

            if (Succeeded)
            {
                Type = typeof(ResultCodeGeneral).PrettyPrint();
                Code = ResultCodeGeneral.NoErrorOccurred;
            }
        }

        protected BaseResult(
            string? extendedMessage = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error
        )
        {
            ExtendedMessage = extendedMessage;
            Severity = severity;

            if (Succeeded)
            {
                Type = typeof(ResultCodeGeneral).PrettyPrint();
                Code = ResultCodeGeneral.NoErrorOccurred;
            }
        }

        protected BaseResult(
            Type type,
            int code,
            string? extendedMessage = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error
        )
        {
            Type = type.PrettyPrint();
            Code = code;
            Severity = severity;
            ExtendedMessage = extendedMessage;
        }

        protected BaseResult(
            string type,
            int code,
            string? extendedMessage = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null
        )
        {
            Type = type;
            Code = code;
            Severity = severity;
            ExtendedMessage = extendedMessage;
            FormattedMessagePlaceholderValues = formattedMessagePlaceholderValues;
        }

        protected BaseResult(
            Exception exception,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            Type? type = null,
            int? code = null
        )
        {
            ExtendedMessage = exception.Message;
            Severity = severity;
            Type = type != null ? type.PrettyPrint() : typeof(ResultCodeGeneral).PrettyPrint();
            Code = code ?? ResultCodeGeneral.NoErrorOccurred;

            if (!string.IsNullOrEmpty(exception.InnerException?.Message))
                ExtendedMessage ??= exception.InnerException.Message;
        }

        public void SetResultCodeType(Type type)
        {
            if (type.PrettyPrint() != null)
                Type = type.PrettyPrint();
        }

        public void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("Code", Code);
            info.AddValue("Type", Type);
            info.AddValue("Severity", Severity);
            info.AddValue("Succeeded", Succeeded);
            info.AddValue("Failed", Failed);
            info.AddValue("ExtendedMessage", ExtendedMessage);
            info.AddValue("FormattedMessagePlaceholderValues", FormattedMessagePlaceholderValues);

            if (Failed)
                info.AddValue("StackTrace", StackTrace);

            InnerGetObjectData(ref info, context);
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
                    baseResult.ExtendedMessage,
                    baseResult.ExtendedMessage,
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

        protected SerializationInfo GetObjectData()
        {
            var info = new SerializationInfo(GetType(), new FormatterConverter());
            GetObjectData(info, new StreamingContext());
            return info;
        }

        protected virtual void InnerGetObjectData(
            ref SerializationInfo info,
            StreamingContext context
        ) { }

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
                        "   at {0}.{1}.{2}(...) in {3}:line {4}{5}",
                        type.Namespace,
                        type.Name,
                        methodBase.Name,
                        stackFrame.GetFileName(),
                        stackFrame.GetFileLineNumber(),
                        Literals.NewLine
                    );
                }

                return stackTrace.ToString();
            }
        }
    }
}
