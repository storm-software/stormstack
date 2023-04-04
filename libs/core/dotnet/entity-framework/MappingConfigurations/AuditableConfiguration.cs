using OpenSystem.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.ValueObjects;
using OpenSystem.Core.EntityFramework.ValueConverters;

namespace OpenSystem.Core.EntityFramework.MappingConfigurations
{
    public abstract class AuditableConfiguration<TEntity, TEntityId>
        : BaseConfiguration<TEntity, TEntityId>
        where TEntity : AuditableEntity<TEntityId>
        where TEntityId : EntityId
    {
        protected override sealed void InnerConfigure(EntityTypeBuilder<TEntity> builder)
        {
            /*builder.OwnsOne(x => x.EventCounter, y => {
              y.Property(r => r.Value)
                .HasColumnName("EventCounter")
                .IsRequired();
            });*/
            builder
                .Property(x => x.Status)
                .IsRequired()
                .HasConversion<EnumIntegerValueConverter<EntityStatusTypes>>();
            builder.Property(x => x.CreatedBy).IsRequired();
            builder.Property(x => x.CreatedDateTime).IsRequired();
            builder
                .Property(x => x.EventType)
                .IsRequired()
                .HasConversion<EnumStringValueConverter<EntityEventTypes>>();

            ConfigureColumns(builder);
        }

        protected virtual void ConfigureColumns(EntityTypeBuilder<TEntity> builder) { }
    }
}
