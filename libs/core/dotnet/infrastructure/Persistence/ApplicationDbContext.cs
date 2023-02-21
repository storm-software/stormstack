using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using OpenSystem.Core.Infrastructure.Services;
using Microsoft.Extensions.Options;
using MediatR;
using Duende.IdentityServer.EntityFramework.Options;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Infrastructure.Extensions;

namespace OpenSystem.Core.Infrastructure.Persistence
{
    public class ApplicationDbContext
      : ApiAuthorizationDbContext<ApplicationUser>, IApplicationDbContext
    {
        protected readonly IDateTimeProvider DateTimeProvider;

        protected readonly ICurrentUserService CurrentUserService;

        private readonly ILoggerFactory _loggerFactory;

        private readonly AuditableEntitySaveChangesInterceptor _auditableEntitySaveChangesInterceptor;

        private readonly IMediator _mediator;

        public ApplicationDbContext(
          DbContextOptions options,
          IOptions<OperationalStoreOptions> operationalStoreOptions,
          IMediator mediator,
          AuditableEntitySaveChangesInterceptor auditableEntitySaveChangesInterceptor,
          IDateTimeProvider dateTimeProvider,
          ICurrentUserService currentUserService,
            ILoggerFactory loggerFactory)
            : base(options, operationalStoreOptions)
        {
            ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;

            DateTimeProvider = dateTimeProvider;
            CurrentUserService = currentUserService;
            _loggerFactory = loggerFactory;
            _mediator = mediator;
            _auditableEntitySaveChangesInterceptor = auditableEntitySaveChangesInterceptor;
        }

        public override int SaveChanges()
        {
            ChangeTracker.Entries()
                .Where(e => e.State is EntityState.Added or EntityState.Modified)
                .Select(e => e.Entity)
                .ToList()
                .ForEach(entity =>
                {
                    var validationContext = new ValidationContext(entity);
                    Validator.ValidateObject(
                        entity,
                        validationContext,
                        validateAllProperties: true);
                });

            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            ChangeTracker.Entries()
              .Where(e => e.State is EntityState.Added or EntityState.Modified)
              .Select(e => e.Entity)
              .ToList()
              .ForEach(entity =>
              {
                  var validationContext = new ValidationContext(entity);
                  Validator.ValidateObject(
                      entity,
                      validationContext,
                      validateAllProperties: true);
              });

            foreach (var entry in ChangeTracker.Entries<Entity<Guid>>())
            {
              if (typeof(IAuditable).IsAssignableFrom(entry.Entity.GetType()))
              {
                var auditable = entry.Entity as IAuditable;
                if (auditable != null)
                {
                  if (entry.State == EntityState.Added)
                  {
                    auditable.CreatedDateTime = DateTimeProvider.OffsetUtcNow;
                    auditable.CreatedBy = CurrentUserService.UserId;
                  }
                  else if (entry.State == EntityState.Modified ||
                    entry.HasChangedOwnedEntities())
                  {
                        auditable.UpdatedDateTime = DateTimeProvider.OffsetUtcNow;
                        auditable.UpdatedBy = CurrentUserService.UserId;
                        break;
                  }
                }
              }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            var ret = InnerOnModelCreating(builder);
            if (ret.Failed)
              throw new GeneralProcessingException();

            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            base.OnModelCreating(builder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLoggerFactory(_loggerFactory);
            optionsBuilder.AddInterceptors(_auditableEntitySaveChangesInterceptor);
        }

        protected virtual Result InnerOnModelCreating(ModelBuilder builder)
        {
            return Result.Success();
        }
    }
}
