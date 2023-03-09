using OpenSystem.Core.Domain.Constants;

namespace OpenSystem.Core.Domain.Settings
{
  public class CsvFileExportServiceSettings : FileExportServiceSettings
  {
    public override string FileExtension { get; set; } = FileExtensions.Csv;
  }
}
