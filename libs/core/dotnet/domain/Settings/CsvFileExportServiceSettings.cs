using OpenSystem.Core.DotNet.Domain.Constants;

namespace OpenSystem.Core.DotNet.Domain.Settings
{
  public class CsvFileExportServiceSettings : FileExportServiceSettings
  {
    public string FileExtension
    {
      get { return FileExtensions.Csv; }
    }
  }
}
