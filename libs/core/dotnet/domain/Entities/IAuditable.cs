using System;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Entities
{
    public interface IAuditable : IVersionedIndex
    {
        public EntityEventTypes EventType { get; set; }

        public EntityStatusTypes Status { get; set; }

        public bool IsApproved { get; set; }

        public string CreatedBy { get; set; }

        public DateTimeOffset? CreatedDateTime { get; set; }

        public string? UpdatedBy { get; set; }

        public DateTimeOffset? UpdatedDateTime { get; set; }
    }
}
