namespace OpenSystem.Core.Domain.Settings
{
    public class ErrorHandlingSettings
    {
        public bool ReportStack { get; set; }

        public int ErrorSeverity { get; set; }

        public string StatusCodesUrl { get; set; } = "https://httpstatuses.com";
    }
}
