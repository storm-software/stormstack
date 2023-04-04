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
//using CsvHelper;
using OpenSystem.Core.Application.Services;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Infrastructure.Services
{
   /* public class CsvFileExportService : BaseFileExportService, ICsvFileExportService
    {
        public new CsvFileExportServiceSettings Settings { get; set; }

        public CsvFileExportService(
            IOptions<CsvFileExportServiceSettings> settings,
            ILogger<CsvFileExportService> logger,
            IDateTimeProvider dateTimeService
        )
            : base(settings, logger, dateTimeService)
        {
            Settings = (CsvFileExportServiceSettings)settings;
        }

        protected override ValueTask<byte[]> BuildFileDataAsync<T>(FileExportRequest<T> request)
        {
            try
            {
                using var memoryStream = new MemoryStream();

                using (var streamWriter = new StreamWriter(memoryStream))
                {
                    using var csvWriter = new CsvWriter(streamWriter, CultureInfo.InvariantCulture);

                    // csvWriter.Configuration.RegisterClassMap<BaseEntity>();

                    csvWriter.WriteRecords(request.Records);
                }

                return ValueTask.FromResult<byte[]>(memoryStream.ToArray());
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                throw new FileExportException(
                    "An exception occurred while exporting the CSV file",
                    ex
                );
            }
        }
    }*/
}
