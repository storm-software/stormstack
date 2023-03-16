using OpenSystem.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ValueObjects;
using System.Linq.Expressions;

namespace OpenSystem.Core.Infrastructure.Persistence.MappingConfigurations
{
  public abstract class BaseConfiguration<TEntity>
    : IEntityTypeConfiguration<TEntity>
    where TEntity : Entity
  {
    protected abstract string TableName { get; }

    protected abstract Expression<Func<TEntity, object?>> PrimaryKey { get; }

    public void Configure(EntityTypeBuilder<TEntity> builder)
    {
      builder.ToTable(TableName);

      /*builder.OwnsOne(x => x.Id,
        y => {
          y.Property(r => r.Value)
          .HasColumnName("Id");
      });*/

      builder.HasKey(PrimaryKey);
      // builder.HasIndex(PrimaryKey);

      builder.HasAlternateKey(x => x.Id);

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
