using OpenSystem.Core.DotNet.Application.Interfaces;
using OpenSystem.Core.DotNet.Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;
using OpenSystem.Core.DotNet.Domain.ValueObjects;
using System.Reflection;

namespace OpenSystem.Core.DotNet.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        private readonly IDateTimeService _dateTime;

        private readonly ILoggerFactory _loggerFactory;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options,
            IDateTimeService dateTime,
            ILoggerFactory loggerFactory)
            : base(options)
        {
            ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;

            _dateTime = dateTime;
            _loggerFactory = loggerFactory;
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

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
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

            foreach (var entry in ChangeTracker.Entries<AuditableBaseEntity<EntityId<object>, object>>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedOn = _dateTime.NowUtc;
                        break;

                    case EntityState.Modified:
                        entry.Entity.ModifiedOn = _dateTime.NowUtc;
                        break;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
           //var _mockData = this.Database.GetService<IMockService>();
            //var seedPositions = _mockData.SeedPositions(1000);
            //builder.Entity<Position>().HasData(seedPositions);

            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            base.OnModelCreating(builder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLoggerFactory(_loggerFactory);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.AddInterceptors(_auditableEntitySaveChangesInterceptor);
        }
    }
}
