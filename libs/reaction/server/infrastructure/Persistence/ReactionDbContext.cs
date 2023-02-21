using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MediatR;
using Duende.IdentityServer.EntityFramework.Options;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Reaction.Domain.Entities;
using OpenSystem.Core.Infrastructure.Persistence;

namespace OpenSystem.Reaction.Infrastructure.Persistence
{
    public class ReactionDbContext : ApplicationDbContext
    {
        public DbSet<ReactionEntity> Reactions => Set<ReactionEntity>();

        public ReactionDbContext(
          DbContextOptions options,
          IOptions<OperationalStoreOptions> operationalStoreOptions,
          IMediator mediator,
          AuditableEntitySaveChangesInterceptor auditableEntitySaveChangesInterceptor,
          IDateTimeProvider dateTimeProvider,
          ICurrentUserService currentUserService,
          ILoggerFactory loggerFactory)
            : base(options,
                operationalStoreOptions,
                mediator,
                auditableEntitySaveChangesInterceptor,
                dateTimeProvider,
                currentUserService,
                loggerFactory)
        {
        }

        protected override Result InnerOnModelCreating(ModelBuilder builder)
        {
          builder.Entity<ReactionEntity>();
          return Result.Success();
        }
    }
}
