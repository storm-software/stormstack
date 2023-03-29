namespace OpenSystem.Core.Domain.Settings
{
    public class ApplicationSettings
    {
        public ApplicationDetailSettings ApplicationDetails { get; set; }

        public JWTSettings? JWTSettings { get; set; }

        public ConnectionStringSettings ConnectionStrings { get; set; }

        public bool UseInMemoryDatabase { get; set; } = false;

        public MailSettings? MailSettings { get; set; }

        public ScheduledServiceSettings? ScheduledServiceSettings { get; set; }

        public FileExportServiceSettings? FileExportServiceSettings { get; set; }

        public EventSourcingSettings EventSourcingSettings { get; set; }
    }
}
