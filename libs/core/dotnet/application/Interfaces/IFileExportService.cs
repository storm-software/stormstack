using OpenSystem.Core.Application.Models.DTOs;
using OpenSystem.Core.Domain.Settings;

namespace OpenSystem.Core.Application.Interfaces
{
    public interface IFileExportService
    {
        public FileExportServiceSettings Settings { get; }

        public Task ExportAsync<T>(FileExportRequest<T> request);
    }
}
