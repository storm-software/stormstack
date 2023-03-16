using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Infrastructure.Extensions;
using OpenSystem.Core.Application.Services;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Exceptions;
using System.ComponentModel.DataAnnotations;

namespace OpenSystem.Core.Infrastructure.Persistence.Interceptors
{
  public class ValidateSaveChangesInterceptor : SaveChangesInterceptor
  {
      public ValidateSaveChangesInterceptor()
      {
      }

      public override InterceptionResult<int> SavingChanges(DbContextEventData eventData,
        InterceptionResult<int> result)
      {
          ValidateEntities(eventData.Context);

          return base.SavingChanges(eventData,
            result);
      }

      public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
      {
          ValidateEntities(eventData.Context);
          return base.SavingChangesAsync(eventData,
            result,
            cancellationToken);
      }

      public void ValidateEntities(DbContext? context)
      {
          if (context == null)
            return;

          context.ChangeTracker.Entries()
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
      }
  }
}
