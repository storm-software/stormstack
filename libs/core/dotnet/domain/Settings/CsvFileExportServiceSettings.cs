using OpenSystem.Core.Domain.Constants;

namespace OpenSystem.Core.Domain.Settings
{
  public class CsvFileExportServiceSettings : FileExportServiceSettings
  {
    public string FileExtension
    {
      get { return FileExtensions.Csv; }
    }
  }
}
