using OpenSystem.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Infrastructure.Persistence.MappingConfigurations
{
  public abstract class BaseAuditableConfiguration<TEntity> : BaseConfiguration<TEntity>
    where TEntity : AuditableEntity
  {
    protected override sealed Result InnerConfigure(EntityTypeBuilder<TEntity> builder)
    {
      /*builder.OwnsOne(x => x.EventCounter, y => {
        y.Property(r => r.Value)
          .HasColumnName("EventCounter")
          .IsRequired();
      });*/
      builder.Property(x => x.Status)
        .IsRequired()
        .HasConversion(
            x => (int)x,
            x => (EntityStatusTypes)x);
      builder.Property(x => x.CreatedBy)
        .IsRequired();
      builder.Property(x => x.CreatedDateTime)
        .IsRequired();
      builder.HasQueryFilter(x => x.Status < EntityStatusTypes.Inactive);

      return ConfigureColumns(builder);
    }

    protected virtual Result ConfigureColumns(EntityTypeBuilder<TEntity> builder)
    {
      return Result.Success();
    }
  }
}
