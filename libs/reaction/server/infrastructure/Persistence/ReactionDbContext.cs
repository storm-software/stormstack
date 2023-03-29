using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OpenSystem.Reaction.Domain.Entities;
using OpenSystem.Core.Infrastructure.Persistence;
using System.Reflection;

namespace OpenSystem.Reaction.Infrastructure.Persistence
{
    /*public class ReactionDbContext : HistoricalDbContext<ReactionEntity>
    {
        public DbSet<ReactionEntity> Reaction => Set<ReactionEntity>();

        public DbSet<ReactionDetailEntity> ReactionDetail => Set<ReactionDetailEntity>();

        public ReactionDbContext(DbContextOptions options)
            : base(options) { }

        public ReactionDbContext(ILoggerFactory loggerFactory, DbContextOptions options)
            : base(loggerFactory, options) { }

        protected override void InnerOnModelCreating(ModelBuilder builder)
        {
            base.InnerOnModelCreating(builder);
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }*/
}
