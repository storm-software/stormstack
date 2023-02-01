using OpenSystem.Contact.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace OpenSystem.Contact.Infrastructure.MappingConfigurations
{
    public class ContactDetailConfiguration : IEntityTypeConfiguration<ContactDetailEntity>
    {
        public void Configure(EntityTypeBuilder<ContactDetailEntity> builder)
        {
          builder.ToTable("ContactDetails");
            builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
        }
    }
}
