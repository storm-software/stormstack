using OpenSystem.Core.Domain.Enums;
using System.Globalization;
using OpenSystem.Core.Domain.Constants;

namespace OpenSystem.Core.Application.Models.DTOs
{
    public record MessageRecord
    {
        public required string Message { get; set; }

        public required string Type { get; set; } = MessageTypes.General.ToString().ToUpper();

        public required int Code { get; set; }

        public CultureInfo? Culture { get; set; } = new CultureInfo(DefaultConfiguration.DefaultCulture);
    };
}
