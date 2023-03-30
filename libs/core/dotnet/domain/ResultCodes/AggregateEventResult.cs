using System.Diagnostics;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;
using FluentValidation.Results;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Extensions;

namespace OpenSystem.Core.Domain.ResultCodes
{
    [Serializable]
    public class AggregateEventResult : Result<IVersionedIndex>, IAggregateEventResult
    {
        public static IAggregateEventResult Success(
            IVersionedIndex? data,
            IReadOnlyCollection<IDomainEvent>? domainEvents = null
        ) => new AggregateEventResult(data, domainEvents);

        public static IAggregateEventResult Success(
            IReadOnlyCollection<IDomainEvent>? domainEvents = null
        ) => new AggregateEventResult(null, domainEvents);

        public static IAggregateEventResult Failure(
            Type type,
            int code,
            string? extendedMessage = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            string? helpLink = null,
            List<FieldValidationResult>? fields = null,
            Dictionary<string, object>? formattedMessagePlaceholderValues = null,
            IReadOnlyCollection<IDomainEvent>? domainEvents = null
        )
        {
            return new AggregateEventResult(
                type,
                code,
                domainEvents,
                extendedMessage,
                severity,
                helpLink,
                fields,
                formattedMessagePlaceholderValues
            );
        }

        public static IAggregateEventResult Failure(
            int code,
            List<FieldValidationResult> fields,
            string? extendedMessage = null,
            IReadOnlyCollection<IDomainEvent>? domainEvents = null
        )
        {
            return new AggregateEventResult(
                typeof(ResultCodeValidation),
                code,
                domainEvents,
                extendedMessage,
                ResultSeverityTypes.Error,
                null,
                fields,
                null
            );
        }

        public static IAggregateEventResult Failure(
            List<FieldValidationResult> fields,
            string? extendedMessage = null,
            IReadOnlyCollection<IDomainEvent>? domainEvents = null
        )
        {
            return new AggregateEventResult(
                typeof(ResultCodeValidation),
                ResultCodeValidation.OneOrMoreValidationFailuresHaveOccurred,
                domainEvents,
                extendedMessage,
                ResultSeverityTypes.Error,
                null,
                fields,
                null
            );
        }

        public IReadOnlyCollection<IDomainEvent>? DomainEvents { get; private set; }

        public AggregateEventResult(
            IVersionedIndex? data,
            IReadOnlyCollection<IDomainEvent>? domainEvents = null
        )
            : base(data)
        {
            DomainEvents = domainEvents;
        }

        public AggregateEventResult(
            Type type,
            int code,
            IReadOnlyCollection<IDomainEvent>? domainEvents = null,
            string? extendedMessage = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            string? helpLink = null,
            List<FieldValidationResult>? fields = null,
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
            )
        {
            DomainEvents = domainEvents;
        }

        public AggregateEventResult(
            string type,
            int code,
            IReadOnlyCollection<IDomainEvent>? domainEvents = null,
            string? extendedMessage = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            string? helpLink = null,
            List<FieldValidationResult>? fields = null,
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
            DomainEvents = domainEvents;
        }

        public AggregateEventResult(
            Exception exception,
            IReadOnlyCollection<IDomainEvent>? domainEvents = null,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            Type? type = null,
            int? code = null
        )
            : base(exception, severity)
        {
            DomainEvents = domainEvents;
        }

        protected override void InnerGetObjectData(
            ref SerializationInfo info,
            StreamingContext context
        )
        {
            base.InnerGetObjectData(ref info, context);

            if (DomainEvents != null)
                info.AddValue("DomainEvents", DomainEvents);
        }

        public void SetDomainEvents(IReadOnlyCollection<IDomainEvent>? domainEvents)
        {
            DomainEvents = domainEvents;
        }
    }
}
