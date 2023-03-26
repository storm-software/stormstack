using OpenSystem.Core.Application.Models.DTOs;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Domain.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Application.Services;

namespace OpenSystem.Core.Infrastructure.Services
{
  public abstract class BaseFileExportService : IFileExportService
  {
    public FileExportServiceSettings Settings { get; }

    protected ILogger<BaseFileExportService> Logger { get; }

    private IDateTimeProvider _dateTimeService { get; }

    public BaseFileExportService(IOptions<FileExportServiceSettings> settings,
      ILogger<BaseFileExportService> logger,
      IDateTimeProvider dateTimeService)
    {
        Settings = settings.Value;
        Logger = logger;
        _dateTimeService = dateTimeService;
    }

    public async Task ExportAsync(FileExportRequest<Entity> request)
    {
        try
        {
            byte[] data = await BuildFileDataAsync(request);
            if (data == null || data.Length == 0)
              throw new FileExportException("No data available to export");

            await ExportFileDataAsync(data);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex.Message,
              ex);

            throw new FileExportException(ex);
        }
    }

    protected abstract ValueTask<byte[]> BuildFileDataAsync(FileExportRequest<Entity> request);

    protected async Task ExportFileDataAsync(byte[] data)
    {
      try
      {
        string filePath = string.Format("{0}{1}{2}{3}.{4}",
          Settings.FilePath,
          Path.DirectorySeparatorChar,
          Settings.FileName,
          Settings.AppendTimestamp == true
            ? $"-{_dateTimeService.OffsetUtcNow.ToString("yyyy’-‘MM’-‘dd’T’HH’:’mm’:’ss")}"
            : string.Empty,
          Settings.FileExtension);

        await File.WriteAllBytesAsync(filePath, data);
      }
      catch (Exception ex)
      {
          Logger.LogError(ex.Message,
            ex);

          throw new FileExportException(ex);
      }
    }
  }
}
