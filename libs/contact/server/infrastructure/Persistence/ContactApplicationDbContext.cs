using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MediatR;
using Duende.IdentityServer.EntityFramework.Options;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Contact.Domain.Entities;
using OpenSystem.Core.Infrastructure.Persistence;

namespace OpenSystem.Contact.Infrastructure.Persistence
{
    public class ContactApplicationDbContext : ApplicationDbContext
    {
        public DbSet<ContactEntity> Contacts => Set<ContactEntity>();

        public ContactApplicationDbContext(
          DbContextOptions options,
          IOptions<OperationalStoreOptions> operationalStoreOptions,
          IMediator mediator,
          AuditableEntitySaveChangesInterceptor auditableEntitySaveChangesInterceptor,
          IDateTimeProvider dateTimeProvider,
          ILoggerFactory loggerFactory)
            : base(options,
                operationalStoreOptions,
                mediator,
                auditableEntitySaveChangesInterceptor,
                dateTimeProvider,
                loggerFactory)
        {
        }

        protected override Result InnerOnModelCreating(ModelBuilder builder)
        {
          builder.Entity<ContactEntity>();
          return Result.Success();
        }
    }
}
