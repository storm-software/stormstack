
using System;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using OpenSystem.Core.Application.Helpers;
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
