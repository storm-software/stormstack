using OpenSystem.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace OpenSystem.Core.Infrastructure.Persistence.MappingConfigurations
{
    public abstract class SoftDeletedAuditableConfiguration<TEntity>
        : AuditableConfiguration<TEntity>
        where TEntity : SoftDeletedAuditableEntity
    {
        protected override void ConfigureColumns(EntityTypeBuilder<TEntity> builder)
        {
            builder.HasQueryFilter(x => !x.IsDeleted);
        }
    }
}
