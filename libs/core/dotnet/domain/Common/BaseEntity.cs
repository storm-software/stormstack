using System;

namespace OpenSystem.Core.DotNet.Domain.Common
{
    public abstract class BaseEntity
    {
        public virtual Guid Id { get; set; }
    }
}
