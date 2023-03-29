using OpenSystem.Reaction.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Infrastructure.Persistence.MappingConfigurations;
using System.Linq.Expressions;

namespace OpenSystem.Reaction.Infrastructure.Persistence.MappingConfigurations
{
    /*public class ReactionConfiguration : AggregateRootConfiguration<ReactionEntity>
    {
        protected override string TableName => "Reaction";

        protected override Expression<Func<ReactionEntity, object?>> AlternateKey =>
            x => x.ContentId;

        protected override void ConfigureColumns(EntityTypeBuilder<ReactionEntity> builder)
        {
            builder
                .HasMany(r => r.Details)
                .WithOne(d => d.Reaction)
                .HasForeignKey(d => d.ReactionId)
                .HasPrincipalKey(x => x.Id)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }*/
}
