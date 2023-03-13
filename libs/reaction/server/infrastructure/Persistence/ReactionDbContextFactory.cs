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
using OpenSystem.Reaction.Infrastructure.MappingConfigurations;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore.Design;

namespace OpenSystem.Reaction.Infrastructure.Persistence
{
    public class ReactionDbContextFactory : IDesignTimeDbContextFactory<ReactionDbContext>
  {
    public ReactionDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ReactionDbContext>();
        optionsBuilder.UseNpgsql("User ID=root;Password=root;Host=localhost;Port=5432;Database=reaction.db;Pooling=true;");

        return new ReactionDbContext(optionsBuilder.Options);
    }
  }
}
