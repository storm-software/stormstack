using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Infrastructure.Extensions;
using System.Transactions;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace OpenSystem.Core.Infrastructure.Persistence
{
    public class ApplicationDbContext<TEntity>
      : DbContext, IApplicationDbContext
      where TEntity : Entity<Guid>
    {
        protected readonly IDateTimeProvider? DateTimeProvider;

        protected readonly ICurrentUserService? CurrentUserService;

        protected readonly IConfiguration? Configuration;

        private readonly ILoggerFactory? _loggerFactory;

        private IDbContextTransaction? _dbContextTransaction;

        public ApplicationDbContext(
          DbContextOptions options)
            : base(options)
        {
            ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        public ApplicationDbContext(
          DbContextOptions options,
          IConfiguration configuration,
          IDateTimeProvider dateTimeProvider,
          ICurrentUserService currentUserService,
            ILoggerFactory loggerFactory)
            : base(options)
        {
            ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;

            DateTimeProvider = dateTimeProvider;
            CurrentUserService = currentUserService;
            Configuration = configuration;
            _loggerFactory = loggerFactory;
        }

        public async Task<IDisposable> BeginTransactionAsync(CancellationToken cancellationToken = default)
        {
            _dbContextTransaction = await Database.BeginTransactionAsync(cancellationToken);

            return _dbContextTransaction;
        }

        public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
        {
            await _dbContextTransaction?.CommitAsync(cancellationToken);
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

            Result ret;
            foreach (var entry in ChangeTracker.Entries<TEntity>())
            {
              ret = ProcessEntry(entry);
              if (ret.Failed)
                throw new FailedResultException(ret);
            }

            ret = InnerSaveChanges();
            if (ret.Failed)
              throw new FailedResultException(ret);

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

            Result ret;
            foreach (var entry in ChangeTracker.Entries<TEntity>())
            {
              ret = ProcessEntry(entry);
              if (ret.Failed)
                throw new FailedResultException(ret);
            }

            ret = InnerSaveChanges();
            if (ret.Failed)
              throw new FailedResultException(ret);

            return await base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            var ret = InnerOnModelCreating(builder);
            if (ret.Failed)
              throw new FailedResultException(ret);

            base.OnModelCreating(builder);
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }

        /*protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            base.OnConfiguring(options);
            options.UseLoggerFactory(_loggerFactory);

            var ret = InnerOnConfiguring(options);
            if (ret.Failed)
              throw new GeneralProcessingException();
        }*/

        protected virtual Result InnerOnModelCreating(ModelBuilder builder)
        {
          return Result.Success();
        }

        protected virtual Result InnerOnConfiguring(DbContextOptionsBuilder options)
        {
          return Result.Success();
        }

        protected virtual Result InnerSaveChanges()
        {
          return Result.Success();
        }

        protected virtual Result InnerProcessEntry(EntityEntry<TEntity> entry)
        {
          return Result.Success();
        }

        private Result ProcessEntry(EntityEntry<TEntity> entry)
        {
          if (typeof(IAuditable).IsAssignableFrom(entry.Entity.GetType()))
          {
            var auditable = entry.Entity as IAuditable;
            if (auditable != null)
            {
              if (entry.State == EntityState.Added)
              {
                auditable.EventCounter = 1;
                if (DateTimeProvider != null)
                  auditable.CreatedDateTime = DateTimeProvider.OffsetUtcNow;
                if (CurrentUserService != null)
                  auditable.CreatedBy = CurrentUserService.UserId;
              }
              else if (entry.State == EntityState.Modified ||
                entry.HasChangedOwnedEntities())
              {
                auditable.EventCounter++;
                if (DateTimeProvider != null)
                  auditable.UpdatedDateTime = DateTimeProvider.OffsetUtcNow;
                if (CurrentUserService != null)
                  auditable.UpdatedBy = CurrentUserService.UserId;
              }
            }
          }

          return InnerProcessEntry(entry);
        }
    }
}
