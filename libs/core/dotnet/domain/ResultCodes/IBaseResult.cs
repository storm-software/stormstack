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

      public string? Detail { get; set; }

      public string? ExtendedDetail { get; set; }

      public Dictionary<string, object>? FormattedMessagePlaceholderValues { get; init; }
    }
}
