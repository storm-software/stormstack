using OpenSystem.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ValueObjects;
using System.Linq.Expressions;

namespace OpenSystem.Core.EntityFramework.MappingConfigurations
{
    public abstract class BaseConfiguration<TEntity, TEntityId> : IEntityTypeConfiguration<TEntity>
        where TEntity : Entity<TEntityId>
        where TEntityId : EntityId
    {
        protected abstract string TableName { get; }

        protected abstract Expression<Func<TEntity, object?>>? AlternateKey { get; }

        public void Configure(EntityTypeBuilder<TEntity> builder)
        {
            builder.ToTable(TableName);
            builder.HasKey(x => x.Id);

            if (AlternateKey != null)
            {
                builder.HasAlternateKey(AlternateKey);
                builder.HasIndex(AlternateKey).IsUnique();
            }

            InnerConfigure(builder);
        }

        protected virtual void InnerConfigure(EntityTypeBuilder<TEntity> builder) { }
    }
}
