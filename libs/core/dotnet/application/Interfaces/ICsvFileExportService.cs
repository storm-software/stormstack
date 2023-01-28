using OpenSystem.Core.DotNet.Application.Models.DTOs;
using OpenSystem.Core.DotNet.Domain.Common;
using OpenSystem.Core.DotNet.Domain.ResultCodes;
using OpenSystem.Core.DotNet.Domain.Settings;

namespace OpenSystem.Core.DotNet.Application.Interfaces
{
  public interface ICsvFileExportService : IFileExportService
  {
    public new CsvFileExportServiceSettings Settings { get; }
  }
}
