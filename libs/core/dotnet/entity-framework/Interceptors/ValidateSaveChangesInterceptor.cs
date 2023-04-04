using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Infrastructure.Extensions;
using OpenSystem.Core.Application.Services;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Exceptions;
using System.ComponentModel.DataAnnotations;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.EntityFramework.Interceptors
{
    public class ValidateSaveChangesInterceptor : SaveChangesInterceptor
    {
        public ValidateSaveChangesInterceptor() { }

        public override InterceptionResult<int> SavingChanges(
            DbContextEventData eventData,
            InterceptionResult<int> result
        )
        {
            AsyncHelper.RunSync(async () => await InnerSavingChangesAsync(eventData.Context));
            return base.SavingChanges(eventData, result);
        }

        public async override ValueTask<InterceptionResult<int>> SavingChangesAsync(
            DbContextEventData eventData,
            InterceptionResult<int> result,
            CancellationToken cancellationToken = default
        )
        {
            await InnerSavingChangesAsync(eventData.Context);
            return base.SavingChangesAsync(eventData, result, cancellationToken)
                .GetAwaiter()
                .GetResult();
        }

        protected async virtual ValueTask InnerSavingChangesAsync(DbContext? context)
        {
            if (context == null)
                return;

            await context.ChangeTracker
                .Entries()
                .Where(e => e.State is EntityState.Added or EntityState.Modified)
                .Select(e => e.Entity)
                .ForEachAsync(async entity =>
                {
                    var validationContext = new ValidationContext(entity);
                    Validator.ValidateObject(
                        entity,
                        validationContext,
                        validateAllProperties: true
                    );
                });
        }
    }
}
