using OpenSystem.User.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace OpenSystem.User.Infrastructure.Persistence
{
    public class UserConfiguration : IEntityTypeConfiguration<UserEntity>
    {
        public void Configure(EntityTypeBuilder<UserEntity> builder)
        {
            builder.Property(t => t.UserId)
              .HasMaxLength(50)
              .IsRequired();

            builder.Property(t => t.Name)
              .HasMaxLength(50)
              .IsRequired();

            builder.Property(t => t.Type)
              .HasMaxLength(50)
              .IsRequired();

            builder.Property(t => t.Status)
              .HasMaxLength(50)
              .IsRequired();

            builder.Property(t => t.Description)
              .HasMaxLength(200);

            builder.Property(t => t.Email.Value)
              .HasMaxLength(50)
              .IsRequired();

            builder.Property(t => t.Culture)
              .HasMaxLength(50)
              .IsRequired();
        }
    }
}
