namespace OpenSystem.Core.Domain.Settings
{
  public class FileExportServiceSettings : FileServiceSettings
  {
    public bool AppendTimestamp { get; set; } = true;
  }
}
