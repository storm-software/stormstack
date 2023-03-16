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
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using OpenSystem.Core.Infrastructure.Persistence.Interceptors;

namespace OpenSystem.Reaction.Infrastructure.Persistence
{
    public class ReactionDbContext : BaseDbContext<ReactionEntity>
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
          ILoggerFactory loggerFactory)
            : base(options,
                configuration,
                loggerFactory)
        {
        }

        protected override Result InnerProcessEntry(EntityEntry<ReactionEntity> entry)
        {
          /*foreach (var detail in entry.Entity.Details)
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
          }*/

          return Result.Success();
        }
    }
}
