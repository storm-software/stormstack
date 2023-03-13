using OpenSystem.Reaction.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Infrastructure.MappingConfigurations;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Reaction.Infrastructure.MappingConfigurations
{
    public class ReactionConfiguration : BaseAuditableConfiguration<ReactionEntity>
    {
        protected override string TableName => "Reaction";

        protected override Result ConfigureColumns(EntityTypeBuilder<ReactionEntity> builder)
        {
          builder.HasIndex(x => new { x.ContentId });

          builder.HasMany(r => r.Details)
            .WithOne(d => d.Reaction)
            .HasForeignKey(d => d.ReactionId)
            .OnDelete(DeleteBehavior.Cascade);

          return Result.Success();
        }
    }
}
