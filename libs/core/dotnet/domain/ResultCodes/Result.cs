using System.Diagnostics;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;
using FluentValidation.Results;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Extensions;

namespace OpenSystem.Core.Domain.ResultCodes
{
    [Serializable]
    public class Result<TData> : BaseResult, IResult<TData>
    {
        public TData? Data { get; set; }

        public string? HelpLink { get; set; }

        public List<ValidationFailure> Fields { get; init; } = new List<ValidationFailure>();

        public static Result<TData> Success() =>
            new Result<TData>(
                typeof(ResultCodeGeneral)?.PrettyPrint(),
                ResultCodeGeneral.NoErrorOccurred
            );

        public static Result<TData> Success(
            TData? data,
            string? detail = null,
            string? extendedDetail = null,
            ResultSeverityTypes severity = ResultSeverityTypes.None,
            string? helpLink = null,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null
        )
        {
            return new Result<TData>(
                data,
                detail != null ? string.Join("\r\n", detail) : null,
                extendedDetail,
                severity,
                helpLink,
                formattedMessagePlaceholderValues
            );
        }

        public static Result<TData> Failure(
            Type type,
            int code,
            string? detail = null,
            string? extendedDetail = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            string? helpLink = null,
            List<ValidationFailure>? fields = null,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null
        )
        {
            return new Result<TData>(
                type,
                code,
                detail,
                extendedDetail,
                severity,
                helpLink,
                fields,
                formattedMessagePlaceholderValues
            );
        }

        public static Result<TData> Failure(
            string type,
            int code,
            string? detail = null,
            string? extendedDetail = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            string? helpLink = null,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null
        )
        {
            return new Result<TData>(
                type,
                code,
                detail,
                extendedDetail,
                severity,
                helpLink,
                formattedMessagePlaceholderValues
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

        protected Result()
            : base(ResultSeverityTypes.None)
        {
            StackTrace = GetStackTrace();
        }

        protected Result(
            TData? data,
            string? detail = null,
            string? extendedDetail = null,
            ResultSeverityTypes severity = ResultSeverityTypes.None,
            string? helpLink = null,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null
        )
            : base(
                typeof(ResultCodeGeneral)?.FullName,
                ResultCodeGeneral.NoErrorOccurred,
                detail,
                extendedDetail,
                severity,
                formattedMessagePlaceholderValues
            )
        {
            Data = data;
            HelpLink = helpLink;
            StackTrace = GetStackTrace();
        }

        protected Result(
            Type type,
            int code,
            string? detail = null,
            string? extendedDetail = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            string? helpLink = null,
            List<ValidationFailure>? fields = null,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null
        )
            : base(
                type?.PrettyPrint(),
                code,
                detail,
                extendedDetail,
                severity,
                formattedMessagePlaceholderValues
            )
        {
            if (fields != null)
                Fields = fields;

            HelpLink = helpLink;
            StackTrace = GetStackTrace();
        }

        protected Result(
            string type,
            int code,
            string? detail = null,
            string? extendedDetail = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            string? helpLink = null,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null
        )
            : base(type, code, detail, extendedDetail, severity, formattedMessagePlaceholderValues)
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
        }

        public ValidationFailure AddField(ValidationFailure field)
        {
            Fields.Add(field);
            return field;
        }

        protected override void InnerGetObjectData(
            ref SerializationInfo info,
            StreamingContext context
        )
        {
            base.InnerGetObjectData(ref info, context);

            if (Data != null)
                info.AddValue("Data", Data);
            if (Fields != null && Fields.Count > 0)
                info.AddValue("Fields", Fields);

            info.AddValue("HelpLink", HelpLink);
        }

        public static implicit operator Result<TData>(Result result) =>
            result.Failed
                ? Result<TData>.Failure(result.Type, result.Code, result.Detail)
                : Result<TData>.Success((TData)result.Data, result.Detail);

        public static implicit operator Result(Result<TData> result) =>
            result.Failed
                ? Result.Failure(result.Type, result.Code, result.Detail)
                : Result.Success(result.Data, result.Detail);

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
        public static new Result Success(
            object? data = null,
            string? detail = null,
            string? extendedDetail = null,
            ResultSeverityTypes severity = ResultSeverityTypes.None,
            string? helpLink = null,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null
        )
        {
            return new Result(
                data,
                detail,
                extendedDetail,
                severity,
                helpLink,
                formattedMessagePlaceholderValues
            );
        }

        public static new Result Failure(
            Type type,
            int code,
            string? detail = null,
            string? extendedDetail = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            string? helpLink = null,
            List<ValidationFailure>? fields = null,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null
        )
        {
            return new Result(
                type,
                code,
                detail,
                extendedDetail,
                severity,
                helpLink,
                fields,
                formattedMessagePlaceholderValues
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

        protected Result(
            object? data,
            string? detail = null,
            string? extendedDetail = null,
            ResultSeverityTypes severity = ResultSeverityTypes.None,
            string? helpLink = null,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null
        )
            : base(
                data,
                detail,
                extendedDetail,
                severity,
                helpLink,
                formattedMessagePlaceholderValues
            ) { }

        protected Result(
            Type type,
            int code,
            string? detail = null,
            string? extendedDetail = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            string? helpLink = null,
            List<ValidationFailure>? fields = null,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null
        )
            : base(
                type,
                code,
                detail,
                extendedDetail,
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
