using System.Diagnostics;
using System.Reflection;
using System.Runtime.Serialization;
using Serilog;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.Constants;
using System.Text;

namespace OpenSystem.Core.Domain.ResultCodes
{
    [Serializable]
    public class Result<TData> : BaseResult, IResult<TData>
    {
        private static ILogger _log = Log.ForContext(typeof(Result<TData>));

        public object? Data { get; set; }

        public string? HelpLink { get; set; }

        public List<IFieldValidationResult> Failures { get; init; } =
            new List<IFieldValidationResult>();

        public static Result<TData> Success() =>
            new Result<TData>(
                typeof(ResultCodeGeneral).PrettyPrint(),
                ResultCodeGeneral.NoErrorOccurred
            );

        public static Result<TData> Success(TData data) => new Result<TData>(data);

        public static Result<TData> Failure(
            Type type,
            int code,
            string? extendedMessage = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            string? helpLink = null,
            List<IFieldValidationResult>? fields = null,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null
        )
        {
            return new Result<TData>(
                type,
                code,
                extendedMessage,
                severity,
                helpLink,
                fields,
                formattedMessagePlaceholderValues
            );
        }

        public static Result<TData> Failure(
            string type,
            int code,
            string? extendedMessage = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            string? helpLink = null,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null
        )
        {
            return new Result<TData>(
                type,
                code,
                extendedMessage,
                severity,
                helpLink,
                formattedMessagePlaceholderValues
            );
        }

        public static Result<TData> Failure(
            List<IFieldValidationResult> fields,
            string? extendedMessage = null
        )
        {
            return new Result<TData>(
                typeof(ResultCodeValidation),
                ResultCodeValidation.OneOrMoreValidationFailuresHaveOccurred,
                extendedMessage,
                ResultSeverityTypes.Error,
                null,
                fields
            );
        }

        public static Result<TData> Failure(
            Exception exception,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            Type? type = null,
            int? code = null
        )
        {
            return new Result<TData>(exception, severity);
        }

        private void LogFailure() => _log.Error(ToErrorString());

        protected Result()
            : base(ResultSeverityTypes.None) { }

        protected Result(TData data)
            : base(ResultSeverityTypes.None)
        {
            Data = data;
        }

        protected Result(
            Type type,
            int code,
            string? extendedMessage = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            string? helpLink = null,
            List<IFieldValidationResult>? fields = null,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null
        )
            : base(
                type.PrettyPrint(),
                code,
                extendedMessage,
                severity,
                formattedMessagePlaceholderValues
            )
        {
            if (fields != null)
                Failures = fields;

            HelpLink = helpLink;
            StackTrace = GetStackTrace();

            LogFailure();
        }

        protected Result(
            string type,
            int code,
            string? extendedMessage = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            string? helpLink = null,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null
        )
            : base(type, code, extendedMessage, severity, formattedMessagePlaceholderValues)
        {
            HelpLink = helpLink;
            StackTrace = GetStackTrace();
        }

        protected Result(
            Exception exception,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            Type? type = null,
            int? code = null
        )
            : base(exception, severity, type, code)
        {
            HelpLink = exception.HelpLink;
            StackTrace = !string.IsNullOrEmpty(exception.StackTrace)
                ? exception.StackTrace
                : GetStackTrace();

            LogFailure();
        }

        public IFieldValidationResult AddFieldError(IFieldValidationResult field)
        {
            Failures.Add(field);
            return field;
        }

        /// <summary>
        /// Format informative display string.
        /// </summary>
        public string ToSerializationString()
        {
            try
            {
                StringBuilder sb = new StringBuilder();

                Type t = Type.GetType();
                sb.Append(t.Assembly.FullName);
                sb.Append(Literals.FieldSeparator);
                sb.Append(t.PrettyPrint());
                sb.Append(Literals.FieldSeparator);
                sb.Append(Code.ToString());
                sb.Append(Literals.FieldSeparator);
                sb.Append(ExtendedMessage);
                sb.Append(Literals.FieldSeparator);
                sb.Append(Severity.ToString());
                sb.Append(Literals.FieldSeparator);
                sb.Append(StackTrace);

                if (FormattedMessagePlaceholderValues != null)
                    foreach (
                        string formattedMessagePlaceholderValue in FormattedMessagePlaceholderValues.Keys
                    )
                    {
                        sb.Append(Literals.FieldSeparator);
                        sb.Append(formattedMessagePlaceholderValue);
                    }

                return sb.ToString();
            }
            catch (Exception x)
            {
                return x.Message;
            }
        }

        /// <summary>
        /// Format informative display string.
        /// </summary>
        public override string ToString()
        {
            try
            {
                if (Succeeded)
                    return ToSuccessString();

                return ToErrorString();
            }
            catch (Exception x)
            {
                return x.Message;
            }
        }

        public string ToErrorString()
        {
            try
            {
                StringBuilder sb = new StringBuilder();

                sb.Append(
                    $"An OpenSystem error has occurred. Please contact your system administrator with the information provided below. {Literals.NewLine}"
                );

                sb.Append($"{Literals.NewLine}---- Error Details ---- ");
                sb.Append($"{Literals.NewLine}Type: ");
                sb.Append(!string.IsNullOrWhiteSpace(Type) ? Type : Literals.NotApplicable);
                sb.Append($"{Literals.NewLine}Code: ");
                sb.Append(
                    !string.IsNullOrWhiteSpace(Code.ToString())
                        ? Code.ToString()
                        : Literals.NotApplicable
                );
                sb.Append($"{Literals.NewLine}Extended message: ");
                sb.Append(
                    !string.IsNullOrWhiteSpace(ExtendedMessage)
                        ? ExtendedMessage
                        : Literals.NotApplicable
                );
                sb.Append($"{Literals.NewLine}Severity: ");
                sb.Append(
                    !string.IsNullOrWhiteSpace(Severity.ToString())
                        ? Severity.ToString()
                        : Literals.NotApplicable
                );
                sb.Append($"{Literals.NewLine}Help Link: ");
                sb.Append(
                    !string.IsNullOrWhiteSpace(HelpLink?.ToString())
                        ? HelpLink.ToString()
                        : Literals.NotApplicable
                );

                if (Failures != null && Failures.Count > 0)
                {
                    sb.Append($"{Literals.NewLine}---- Validation Failures ---- ");
                    foreach (FieldValidationResult failure in Failures)
                    {
                        sb.Append($"{Literals.NewLine}{Literals.Tab}FieldName: ");
                        sb.Append(
                            !string.IsNullOrWhiteSpace(failure.FieldName?.ToString())
                                ? failure.FieldName.ToString()
                                : Literals.NotApplicable
                        );
                        sb.Append($"{Literals.NewLine}{Literals.Tab}AttemptedValue: ");
                        sb.Append(
                            !string.IsNullOrWhiteSpace(failure.AttemptedValue?.ToString())
                                ? failure.AttemptedValue.ToString()
                                : Literals.NotApplicable
                        );
                        sb.Append($"{Literals.NewLine}{Literals.Tab}Type: ");
                        sb.Append(
                            !string.IsNullOrWhiteSpace(failure.Type)
                                ? failure.Type
                                : Literals.NotApplicable
                        );
                        sb.Append($"{Literals.NewLine}{Literals.Tab}Code: ");
                        sb.Append(
                            !string.IsNullOrWhiteSpace(failure.Code.ToString())
                                ? failure.Code.ToString()
                                : Literals.NotApplicable
                        );
                        sb.Append($"{Literals.NewLine}{Literals.Tab}ExtendedMessage: ");
                        sb.Append(
                            !string.IsNullOrWhiteSpace(failure.ExtendedMessage?.ToString())
                                ? failure.ExtendedMessage.ToString()
                                : Literals.NotApplicable
                        );
                        sb.Append($"{Literals.NewLine}{Literals.Tab}Severity: ");
                        sb.Append(
                            $"{(
                                (ResultSeverityTypes)
                                    Enum.ToObject(typeof(ResultSeverityTypes), failure.Severity)
                            ).ToString()}{Literals.NewLine}"
                        );
                    }
                }

                if (!string.IsNullOrWhiteSpace(StackTrace))
                {
                    sb.Append($"{Literals.NewLine}---- Stack Trace ---- {Literals.NewLine}");
                    sb.Append(
                        !string.IsNullOrWhiteSpace(StackTrace) ? StackTrace : Literals.NotApplicable
                    );
                }

                return sb.ToString();
            }
            catch (Exception x)
            {
                return x.Message;
            }
        }

        public string ToSuccessString()
        {
            try
            {
                StringBuilder sb = new StringBuilder();

                sb.Append($"Request complete successfully. {Literals.NewLine}");

                sb.Append($"{Literals.NewLine}---- Result Details ---- ");
                sb.Append($"{Literals.NewLine}Type: ");
                sb.Append(!string.IsNullOrWhiteSpace(Type) ? Type : Literals.NotApplicable);
                sb.Append($"{Literals.NewLine}Code: ");
                sb.Append(
                    !string.IsNullOrWhiteSpace(Code.ToString())
                        ? Code.ToString()
                        : Literals.NotApplicable
                );
                sb.Append($"{Literals.NewLine}Extended message: ");
                sb.Append(
                    !string.IsNullOrWhiteSpace(ExtendedMessage)
                        ? ExtendedMessage
                        : Literals.NotApplicable
                );
                sb.Append($"{Literals.NewLine}Severity: ");
                sb.Append(
                    !string.IsNullOrWhiteSpace(Severity.ToString())
                        ? Severity.ToString()
                        : Literals.NotApplicable
                );
                sb.Append($"{Literals.NewLine}Help Link: ");
                sb.Append(
                    !string.IsNullOrWhiteSpace(HelpLink?.ToString())
                        ? HelpLink.ToString()
                        : Literals.NotApplicable
                );

                sb.Append($"{Literals.NewLine}---- Data ---- {Literals.NewLine}");
                sb.Append(Data != null ? Data : Literals.NotApplicable);

                return sb.ToString();
            }
            catch (Exception x)
            {
                return x.Message;
            }
        }

        public string ToDisplayString(string strAdditionalInformation)
        {
            try
            {
                string str = string.Format(
                    "{0}[{1}]\r\n{2}\r\n{3}\r\n",
                    Type.ToString(),
                    Code,
                    strAdditionalInformation,
                    ExtendedMessage
                );

                return str;
            }
            catch (Exception x)
            {
                return x.Message;
            }
        }

        public string ToValidationMessage(string strMessage)
        {
            try
            {
                if (strMessage == null)
                    strMessage = Type.ToString();

                string str = string.Format("{0} [{1},{2}]", strMessage, Code, Type.ToString());

                return str;
            }
            catch (Exception x)
            {
                return x.Message;
            }
        }

        protected override void InnerGetObjectData(
            ref SerializationInfo info,
            StreamingContext context
        )
        {
            base.InnerGetObjectData(ref info, context);

            if (Data != null)
                info.AddValue("Data", Data);
            if (Failures != null && Failures.Count > 0)
                info.AddValue("Fields", Failures);

            info.AddValue("HelpLink", HelpLink);
        }

        public static implicit operator Result<TData>(Result result) =>
            result.Failed
                ? Result<TData>.Failure(result.Type, result.Code, result.ExtendedMessage)
                : Result<TData>.Success((TData)result.Data);

        public static implicit operator Result(Result<TData> result) =>
            result.Failed
                ? Result.Failure(result.Type, result.Code, result.ExtendedMessage)
                : Result.Success(result.Data);

        public override bool Equals(object? obj)
        {
            if (ReferenceEquals(obj, null) || !(obj is BaseResult baseResult))
                return false;

            return base.Equals(baseResult);
        }

        public override int GetHashCode()
        {
            return base.GetHashCode() + (HelpLink + StackTrace).GetHashCode();
        }
    }

    [Serializable]
    public class Result : Result<object>
    {
        public static new Result Success(object? data = null)
        {
            return new Result(data);
        }

        public static Result Success(IIdentity id, ulong version)
        {
            return Result<IVersionedIndex<IIdentity>>.Success(
                new VersionedIndex<IIdentity>(id, version)
            );
        }

        public static new Result Failure(
            Type type,
            int code,
            string? extendedMessage = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            string? helpLink = null,
            List<IFieldValidationResult>? fields = null,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null
        )
        {
            return new Result(
                type,
                code,
                extendedMessage,
                severity,
                helpLink,
                fields,
                formattedMessagePlaceholderValues
            );
        }

        public static Result Failure(
            int code,
            List<IFieldValidationResult> fields,
            string? extendedMessage = null
        )
        {
            return new Result(
                typeof(ResultCodeValidation),
                code,
                extendedMessage,
                ResultSeverityTypes.Error,
                null,
                fields
            );
        }

        public static new Result Failure(
            List<IFieldValidationResult> fields,
            string? extendedMessage = null
        )
        {
            return new Result(
                typeof(ResultCodeValidation),
                ResultCodeValidation.OneOrMoreValidationFailuresHaveOccurred,
                extendedMessage,
                ResultSeverityTypes.Error,
                null,
                fields
            );
        }

        public static Result Failure(
            Type type,
            Exception exception,
            ResultSeverityTypes severity = ResultSeverityTypes.Error
        )
        {
            return new Result(exception, severity);
        }

        protected Result(object? data)
            : base(data) { }

        protected Result(
            Type type,
            int code,
            string? extendedMessage = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            string? helpLink = null,
            List<IFieldValidationResult>? fields = null,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null
        )
            : base(
                type,
                code,
                extendedMessage,
                severity,
                helpLink,
                fields,
                formattedMessagePlaceholderValues
            ) { }

        protected Result(
            Exception exception,
            ResultSeverityTypes severity = ResultSeverityTypes.Error
        )
            : base(exception, severity) { }
    }
}
