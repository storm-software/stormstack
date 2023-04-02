using System.Runtime.Serialization;
using OpenSystem.Core.Domain.ReadStores;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Extensions;

namespace OpenSystem.Core.Domain.ResultCodes
{
    [Serializable]
    public class ReadModelUpdateResult<TReadModel> : Result<ReadModelEnvelope<TReadModel>>
        where TReadModel : class, IReadModel
    {
        public static ReadModelUpdateResult<TReadModel> Success(bool isModified) =>
            new ReadModelUpdateResult<TReadModel>(
                typeof(ResultCodeGeneral).PrettyPrint(),
                ResultCodeGeneral.NoErrorOccurred,
                isModified
            );

        public bool IsModified { get; }

        public ReadModelUpdateResult(string readModelId, TReadModel readModel, ulong? version)
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
            string? extendedMessage = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            string? helpLink = null,
            IList<FieldValidationResult>? fields = null,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null
        )
            : base(
                type,
                code,
                extendedMessage,
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
            info.AddValue("IsModified", IsModified);
        }
    }
}
