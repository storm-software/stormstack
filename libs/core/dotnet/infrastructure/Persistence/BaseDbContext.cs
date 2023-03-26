using OpenSystem.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using OpenSystem.Core.Domain.Repositories;
using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Infrastructure.Persistence
{
    public class BaseDbContext<TEntity>
      : DbContext, IBaseDbContext<TEntity>
      where TEntity : AggregateRoot
    {
    private readonly ILoggerFactory? _loggerFactory;

    public BaseDbContext(DbContextOptions options)
      : base(options)
    {
      ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
    }

    public BaseDbContext(ILoggerFactory loggerFactory,
      DbContextOptions options)
      : base(options)
    {
      ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
      _loggerFactory = loggerFactory;
    }

    public override int SaveChanges()
    {
      InnerSaveChangesAsync()
        .GetAwaiter()
        .GetResult();
      return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
      await InnerSaveChangesAsync();
      return await base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
      base.OnModelCreating(builder);
      InnerOnModelCreating(builder);

      builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
      base.OnConfiguring(options);
      options.UseLoggerFactory(_loggerFactory);

      InnerOnConfiguring(options);
    }

    protected virtual void InnerOnModelCreating(ModelBuilder builder)
    {
    }

    protected virtual void InnerOnConfiguring(DbContextOptionsBuilder options)
    {
    }

    protected virtual ValueTask InnerSaveChangesAsync()
    {
      return ValueTask.CompletedTask;
    }

    protected virtual void UpdateConcurrencyStamp(EntityEntry entry)
    {
      if (entry.Entity is IConcurrencyStamped concurrencyStamped)
      {
        Entry(concurrencyStamped)
          .Property(x => x.ConcurrencyStamp)
          .OriginalValue = concurrencyStamped.ConcurrencyStamp;
        concurrencyStamped.ConcurrencyStamp = GuidUtility
          .Instance
          .CreateGuid()
          .ToString("N");
      }
    }

    protected virtual void SetConcurrencyStampIfNull(EntityEntry entry)
    {
      if (entry.Entity is IConcurrencyStamped concurrencyStamped &&
        concurrencyStamped.ConcurrencyStamp != null)
        concurrencyStamped.ConcurrencyStamp = GuidUtility
          .Instance
          .CreateGuid()
          .ToString("N");
    }
  }
}
