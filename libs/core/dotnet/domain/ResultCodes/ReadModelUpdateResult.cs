using System.Diagnostics;
using System.Reflection;
using System.Runtime.Serialization;
using OpenSystem.Core.Domain.ReadStores;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Domain.ResultCodes
{
    [Serializable]
    public class ReadModelUpdateResult<TReadModel> : Result<ReadModelEnvelope<TReadModel>>
        where TReadModel : class, IReadModel
    {
        public static ReadModelUpdateResult<TReadModel> Success(bool isModified) =>
            new ReadModelUpdateResult<TReadModel>(
                typeof(ResultCodeGeneral)?.FullName,
                ResultCodeGeneral.NoErrorOccurred,
                isModified
            );

        public bool IsModified { get; }

        public ReadModelUpdateResult(string readModelId, TReadModel readModel, long? version)
            : this(ReadModelEnvelope<TReadModel>.With(readModelId, readModel, version), true) { }

        public ReadModelUpdateResult(ReadModelEnvelope<TReadModel> envelope, bool isModified)
            : base(envelope)
        {
            IsModified = isModified;
        }

        public ReadModelUpdateResult(
            string type,
            int code,
            bool isModified,
            string? detail = null,
            string? extendedDetail = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            string? helpLink = null,
            IList<FieldValidationResult>? fields = null,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null
        )
            : base(
                type,
                code,
                detail,
                extendedDetail,
                severity,
                helpLink,
                formattedMessagePlaceholderValues
            )
        {
            IsModified = isModified;
        }

        public ReadModelUpdateResult(
            Exception exception,
            bool isModified,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            Type? type = null,
            int? code = null
        )
            : base(exception, severity)
        {
            IsModified = isModified;
        }

        protected override void InnerGetObjectData(
            ref SerializationInfo info,
            StreamingContext context
        )
        {
            base.InnerGetObjectData(ref info, context);

            if (IsModified != null)
                info.AddValue("IsModified", IsModified);
        }
    }
}
