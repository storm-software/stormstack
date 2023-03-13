using OpenSystem.Reaction.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OpenSystem.Reaction.Domain.Enums;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Infrastructure.MappingConfigurations;

namespace OpenSystem.Reaction.Infrastructure.MappingConfigurations
{
    public class ReactionDetailConfiguration : BaseAuditableConfiguration<ReactionDetailEntity>
    {
        protected override string TableName => "ReactionDetail";

        protected override Result ConfigureColumns(EntityTypeBuilder<ReactionDetailEntity> builder)
        {
          builder.HasIndex(x => new { x.ReactionId,
            x.UserId });

          builder.Property(x => x.Type)
            .HasConversion(
                x => x.ToString(),
                x => (ReactionTypes)Enum.Parse(typeof(ReactionTypes),
                  x));

          return Result.Success();
        }
    }
}
