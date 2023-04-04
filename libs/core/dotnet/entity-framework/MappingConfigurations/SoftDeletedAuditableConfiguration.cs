using OpenSystem.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.EntityFramework.MappingConfigurations
{
    public abstract class SoftDeletedAuditableConfiguration<TEntity, TEntityId>
        : AuditableConfiguration<TEntity, TEntityId>
        where TEntity : SoftDeletedAuditableEntity<TEntityId>
        where TEntityId : EntityId
    {
        protected override void ConfigureColumns(EntityTypeBuilder<TEntity> builder)
        {
            builder.HasQueryFilter(x => !x.IsDeleted);
        }
    }
}
