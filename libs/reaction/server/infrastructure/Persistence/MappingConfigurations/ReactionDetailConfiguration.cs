using OpenSystem.Reaction.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OpenSystem.Reaction.Domain.Enums;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Infrastructure.Persistence.MappingConfigurations;
using System.Linq.Expressions;

namespace OpenSystem.Reaction.Infrastructure.Persistence.MappingConfigurations
{
    public class ReactionDetailConfiguration : BaseAuditableConfiguration<ReactionDetailEntity>
    {
        protected override string TableName => "ReactionDetail";

        protected override Expression<Func<ReactionDetailEntity, object?>> PrimaryKey => x => new {
            x.ReactionId,
            x.UserId
          };

        protected override Result ConfigureColumns(EntityTypeBuilder<ReactionDetailEntity> builder)
        {
          builder.Property(x => x.Type)
            .HasConversion(
                x => x.ToString(),
                x => (ReactionTypes)Enum.Parse(typeof(ReactionTypes),
                  x));

          return Result.Success();
        }
    }
}
