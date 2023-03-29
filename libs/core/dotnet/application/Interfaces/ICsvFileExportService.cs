using OpenSystem.Core.Application.Models.DTOs;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Settings;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Interfaces
{
    public interface ICsvFileExportService : IFileExportService
    {
        public new CsvFileExportServiceSettings Settings { get; }
    }
}
