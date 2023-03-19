using OpenSystem.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Infrastructure.Persistence.MappingConfigurations
{
  public abstract class AggregateRootConfiguration<TEntity>
    : SoftDeletedAuditableConfiguration<TEntity>
    where TEntity : AggregateRoot
  {
    protected override void ConfigureColumns(EntityTypeBuilder<TEntity> builder)
    {
      builder.Ignore(x => x.DomainEvents);
      base.ConfigureColumns(builder);
    }
  }
}
