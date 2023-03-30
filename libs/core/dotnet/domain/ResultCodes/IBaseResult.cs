using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Core.Domain.Common
{
    public interface IBaseResult
    {
        public int Code { get; set; }

        public string Type { get; set; }

        public ResultSeverityTypes Severity { get; set; }

        public bool Succeeded { get; }

        public bool Failed => !Succeeded;

        public string? ExtendedMessage { get; set; }

        public string? StackTrace { get; set; }

        public Dictionary<string, object>? FormattedMessagePlaceholderValues { get; init; }
    }
}
