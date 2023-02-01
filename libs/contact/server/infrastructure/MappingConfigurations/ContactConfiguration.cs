using OpenSystem.Contact.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace OpenSystem.Contact.Infrastructure.MappingConfigurations
{
    public class ContactConfiguration : IEntityTypeConfiguration<ContactEntity>
    {
        public void Configure(EntityTypeBuilder<ContactEntity> builder)
        {
          builder.ToTable("Contacts");

          builder.Property(x => x.Id)
            .HasDefaultValueSql("newsequentialid()")
            .IsRequired();

          builder.HasMany(x => x.Details)
            .WithOne(x => x.Contact)
            .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
