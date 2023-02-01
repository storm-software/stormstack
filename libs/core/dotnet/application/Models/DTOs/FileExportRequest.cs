namespace OpenSystem.Core.Application.Models.DTOs
{
    public class FileExportRequest<T>
    {
        public IEnumerable<T> Records { get; set; }
    }
}
