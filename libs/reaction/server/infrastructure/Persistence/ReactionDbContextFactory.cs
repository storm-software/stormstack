using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace OpenSystem.Reaction.Infrastructure.Persistence
{
  public class ReactionDbContextFactory
    : IDesignTimeDbContextFactory<ReactionDbContext>
  {
    public ReactionDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ReactionDbContext>();
        optionsBuilder.UseNpgsql("User ID=root;Password=root;Host=localhost;Port=5432;Database=reaction.db;Pooling=true;");

        return new ReactionDbContext(optionsBuilder.Options);
    }
  }
}
