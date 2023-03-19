using OpenSystem.Reaction.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OpenSystem.Reaction.Domain.Enums;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Infrastructure.Persistence.MappingConfigurations;
using System.Linq.Expressions;
using OpenSystem.Core.Infrastructure.Persistence.ValueConverters;

namespace OpenSystem.Reaction.Infrastructure.Persistence.MappingConfigurations
{
    public class ReactionDetailConfiguration : AuditableConfiguration<ReactionDetailEntity>
    {
        protected override string TableName => "ReactionDetail";

        protected override Expression<Func<ReactionDetailEntity, object?>> PrimaryKey => x => new {
            x.ReactionId,
            x.UserId
          };

        protected override void ConfigureColumns(EntityTypeBuilder<ReactionDetailEntity> builder)
        {
          builder.Property(x => x.Type)
            .HasConversion<EnumStringValueConverter<ReactionTypes>>();
        }
    }
}
