using OpenSystem.Core.Application.Models.DTOs;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Domain.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Infrastructure.Mappings;
using System.Globalization;
using CsvHelper;

namespace OpenSystem.Core.Infrastructure.Services
{
  public class CsvFileExportService : BaseFileExportService, ICsvFileExportService
  {
    public CsvFileExportServiceSettings Settings { get; set; }


    public CsvFileExportService(IOptions<CsvFileExportServiceSettings> settings,
      ILogger<CsvFileExportService> logger,
      IDateTimeProvider dateTimeService)
      : base(settings,
          logger,
          dateTimeService)
    {
      Settings = (CsvFileExportServiceSettings)settings;
    }

    protected override Result BuildFileData(FileExportRequest<Entity<Guid>> request,
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
