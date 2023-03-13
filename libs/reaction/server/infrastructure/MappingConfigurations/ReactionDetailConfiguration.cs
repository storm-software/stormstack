using OpenSystem.Reaction.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OpenSystem.Reaction.Domain.Enums;
using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Reaction.Infrastructure.MappingConfigurations
{
    public class ReactionDetailConfiguration : IEntityTypeConfiguration<ReactionDetailEntity>
    {
        public void Configure(EntityTypeBuilder<ReactionDetailEntity> builder)
        {
          builder.ToTable("ReactionDetail");

          builder.Property(x => x.Id);
          builder.Property(x => x.VerificationCode)
            .HasConversion(
                x => (int)x,
                x => (VerificationCodeTypes)x);
          builder.Property(x => x.Type)
            .HasConversion(
                x => x.ToString(),
                x => (ReactionTypes)Enum.Parse(typeof(ReactionTypes),
                  x));
        }
    }
}
