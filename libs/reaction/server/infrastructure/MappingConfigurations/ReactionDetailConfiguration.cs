using OpenSystem.Reaction.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace OpenSystem.Reaction.Infrastructure.MappingConfigurations
{
    public class ReactionDetailConfiguration : IEntityTypeConfiguration<ReactionDetailEntity>
    {
        public void Configure(EntityTypeBuilder<ReactionDetailEntity> builder)
        {
          builder.ToTable("ReactionDetail");

          builder.Property(x => x.Id)
            .HasDefaultValueSql("newsequentialid()");
        }
    }
}
