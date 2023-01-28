using OpenSystem.Core.DotNet.Application.Models.DTOs;
using OpenSystem.Core.DotNet.Application.Interfaces;
using OpenSystem.Core.DotNet.Domain.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OpenSystem.Core.DotNet.Domain.Common;
using OpenSystem.Core.DotNet.Domain.ResultCodes;
using OpenSystem.Core.DotNet.Domain.Exceptions;

namespace OpenSystem.Core.DotNet.Infrastructure.Services
{
  public abstract class BaseFileExportService : IFileExportService
  {
    public FileExportServiceSettings Settings { get; }

    protected ILogger<BaseFileExportService> Logger { get; }

    private IDateTimeService _dateTimeService { get; }

    public BaseFileExportService(IOptions<FileExportServiceSettings> settings,
      ILogger<BaseFileExportService> logger,
      IDateTimeService dateTimeService)
    {
        Settings = settings.Value;
        Logger = logger;
        _dateTimeService = dateTimeService;
    }

    public async Task<Result> ExportAsync(FileExportRequest<BaseEntity> request)
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

    protected abstract Result BuildFileData(FileExportRequest<BaseEntity> request,
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
            ? $"-{_dateTimeService.NowUtc.ToString("yyyy’-‘MM’-‘dd’T’HH’:’mm’:’ss")}"
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
