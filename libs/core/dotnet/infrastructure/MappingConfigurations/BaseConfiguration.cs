using OpenSystem.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;

namespace OpenSystem.Core.Infrastructure.MappingConfigurations
{
  public abstract class BaseConfiguration<TEntity>
    where TEntity : Entity<Guid>
  {
    protected abstract string TableName { get; }

    public void Configure(EntityTypeBuilder<TEntity> builder)
    {
      builder.ToTable(TableName);

      builder.Property(r => r.Id)
        .IsRequired();
      builder.HasKey(r => r.Id);     

      var ret = InnerConfigure(builder);
      if (ret.Failed)
        throw new FailedResultException(ret);
    }

    protected virtual Result InnerConfigure(EntityTypeBuilder<TEntity> builder)
    {
      return Result.Success();
    }
  }
}
