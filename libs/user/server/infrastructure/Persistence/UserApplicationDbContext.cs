using OpenSystem.Core.DotNet.Application.Interfaces;
using OpenSystem.Core.DotNet.Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using OpenSystem.Core.DotNet.Infrastructure.Services;
using Microsoft.Extensions.Options;
using MediatR;
using Duende.IdentityServer.EntityFramework.Options;
using OpenSystem.Core.DotNet.Domain.ResultCodes;
using OpenSystem.Core.DotNet.Domain.Exceptions;
using OpenSystem.User.Domain.Entities;

namespace OpenSystem.Core.DotNet.Infrastructure.Persistence
{
    public class UserApplicationDbContext : ApplicationDbContext
    {
        public DbSet<UserEntity> UserAccounts => Set<UserEntity>();

        public UserApplicationDbContext(
          DbContextOptions<ApplicationDbContext> options,
          IOptions<OperationalStoreOptions> operationalStoreOptions,
          IMediator mediator,
          AuditableEntitySaveChangesInterceptor auditableEntitySaveChangesInterceptor,
          IDateTimeService dateTimeService,
          ILoggerFactory loggerFactory)
            : base(options,
                operationalStoreOptions,
                mediator,
                auditableEntitySaveChangesInterceptor,
                dateTimeService,
                loggerFactory)
        {
        }

        protected override Result InnerOnModelCreating(ModelBuilder builder)
        {
          builder.Entity<UserEntity>();

          return Result.Success();
        }
    }
}
