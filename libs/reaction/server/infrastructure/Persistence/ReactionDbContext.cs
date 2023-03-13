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
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace OpenSystem.Reaction.Infrastructure.Persistence
{
    public class ReactionDbContext : ApplicationDbContext<ReactionEntity>
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
          //builder.ApplyConfiguration(new ReactionConfiguration());
          //builder.ApplyConfiguration(new ReactionDetailConfiguration());

          return Result.Success();
        }

        protected override Result InnerProcessEntry(EntityEntry<ReactionEntity> entry)
        {
          foreach (var detail in entry.Entity.Details)
          {
            if (detail.EventCounter < 1)
            {
              if (DateTimeProvider != null)
                detail.CreatedDateTime = DateTimeProvider.OffsetUtcNow;
              if (CurrentUserService != null)
                detail.CreatedBy = CurrentUserService.UserId;
            }
            else
            {
              if (DateTimeProvider != null)
                detail.UpdatedDateTime = DateTimeProvider.OffsetUtcNow;
              if (CurrentUserService != null)
                detail.UpdatedBy = CurrentUserService.UserId;
            }

            detail.EventCounter++;
          }

          return Result.Success();
        }
    }
}
