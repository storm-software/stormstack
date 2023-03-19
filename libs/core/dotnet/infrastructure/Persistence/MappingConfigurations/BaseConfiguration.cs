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
      builder.HasKey(PrimaryKey);

      builder.Property(r => r.Id)
        .IsRequired();
      builder.HasAlternateKey(x => x.Id);
      builder.HasIndex(x => x.Id)
        .IsUnique();

      InnerConfigure(builder);
    }

    protected virtual void InnerConfigure(EntityTypeBuilder<TEntity> builder)
    {
    }
  }
}
