using OpenSystem.Core.Application.Models.DTOs;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Domain.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.Entities;

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

    public async Task<Result> ExportAsync(FileExportRequest<Entity<Guid>> request)
    {
        try
        {
            Result ret = BuildFileData(request,
              out byte[]? data);
            if (ret.Failed)
              return ret;
            if (data == null || data.Length == 0)
              return Result.Success();

            return await ExportFileDataAsync(data);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex.Message,
              ex);

            throw new FileExportException(ex);
        }
    }

    protected abstract Result BuildFileData(FileExportRequest<Entity<Guid>> request,
      out byte[]? data);

    protected async Task<Result> ExportFileDataAsync(byte[] data)
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

        return Result.Success();
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
