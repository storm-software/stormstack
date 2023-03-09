namespace OpenSystem.Core.Domain.Settings
{
  public class MailSettings
  {
    public string EmailFrom { get; set; }

    public string SmtpHost { get; set; }

    public int SmtpPort { get; set; }

    public string SmtpUser { get; set; }

    public string SmtpPassword { get; set; }

    public string DisplayName { get; set; }

    public bool EnableSsl { get; set; } = true;

  }
}
