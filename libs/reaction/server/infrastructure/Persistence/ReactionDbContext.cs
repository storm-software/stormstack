using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MediatR;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Reaction.Domain.Entities;
using OpenSystem.Core.Infrastructure.Persistence;
using OpenSystem.Reaction.Infrastructure.MappingConfigurations;
using Microsoft.Extensions.Configuration;

namespace OpenSystem.Reaction.Infrastructure.Persistence
{
    public class ReactionDbContext : ApplicationDbContext
    {
        public DbSet<ReactionEntity> Reaction => Set<ReactionEntity>();

        public DbSet<ReactionDetailEntity> ReactionDetail => Set<ReactionDetailEntity>();

        public ReactionDbContext(
          DbContextOptions options)
            : base(options)
        {
        }

        public ReactionDbContext(
          DbContextOptions options,
          IConfiguration configuration,
          IDateTimeProvider dateTimeProvider,
          ICurrentUserService currentUserService,
          ILoggerFactory loggerFactory)
            : base(options,
                configuration,
                dateTimeProvider,
                currentUserService,
                loggerFactory)
        {
        }

        protected override Result InnerOnModelCreating(ModelBuilder builder)
        {
          builder.ApplyConfiguration(new ReactionConfiguration());
          builder.ApplyConfiguration(new ReactionDetailConfiguration());

          return Result.Success();
        }
    }
}
