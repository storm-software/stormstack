using OpenSystem.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Core.Infrastructure.MappingConfigurations
{
  public abstract class BaseAuditableConfiguration<TEntity> : BaseConfiguration<TEntity>
    where TEntity : AuditableEntity<Guid>
  {
    protected override sealed Result InnerConfigure(EntityTypeBuilder<TEntity> builder)
    {
      builder.Property(x => x.VerificationCode)
        .IsRequired()
        .HasConversion(
            x => (int)x,
            x => (VerificationCodeTypes)x);
      builder.Property(x => x.CreatedBy)
        .IsRequired();
      builder.Property(x => x.CreatedDateTime)
        .IsRequired();

      return ConfigureColumns(builder);
    }

    protected virtual Result ConfigureColumns(EntityTypeBuilder<TEntity> builder)
    {
      return Result.Success();
    }
  }
}
