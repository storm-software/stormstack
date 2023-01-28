namespace OpenSystem.Core.DotNet.Application.Models.DTOs
{
    public class FileExportRequest<T>
    {
        public IEnumerable<T> Records { get; set; }
    }
}
