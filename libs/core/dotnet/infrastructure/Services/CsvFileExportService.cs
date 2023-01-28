using OpenSystem.Core.DotNet.Application.Models.DTOs;
using OpenSystem.Core.DotNet.Application.Interfaces;
using OpenSystem.Core.DotNet.Domain.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OpenSystem.Core.DotNet.Domain.Common;
using OpenSystem.Core.DotNet.Domain.ResultCodes;
using OpenSystem.Core.DotNet.Domain.Exceptions;
using OpenSystem.Core.DotNet.Infrastructure.Mappings;
using System.Globalization;
using CsvHelper;

namespace OpenSystem.Core.DotNet.Infrastructure.Services
{
  public class CsvFileExportService : BaseFileExportService, ICsvFileExportService
  {
    public CsvFileExportServiceSettings Settings { get; set; }


    public CsvFileExportService(IOptions<CsvFileExportServiceSettings> settings,
      ILogger<CsvFileExportService> logger,
      IDateTimeService dateTimeService)
      : base(settings,
          logger,
          dateTimeService)
    {
      Settings = (CsvFileExportServiceSettings)settings;
    }

    protected override Result BuildFileData(FileExportRequest<BaseEntity> request,
      out byte[]? oData)
    {
      oData = null;
      try
      {
        using var memoryStream = new MemoryStream();

        using (var streamWriter = new StreamWriter(memoryStream))
        {
            using var csvWriter = new CsvWriter(streamWriter,
              CultureInfo.InvariantCulture);

            // csvWriter.Configuration.RegisterClassMap<BaseEntity>();

            csvWriter.WriteRecords(request.Records);
        }

        oData = memoryStream.ToArray();

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
