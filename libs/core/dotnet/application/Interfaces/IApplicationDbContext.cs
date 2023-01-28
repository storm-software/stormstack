namespace OpenSystem.Core.DotNet.Application.Interfaces
{
   public interface IApplicationDbContext
  {
      Task<int> SaveChangesAsync(CancellationToken cancellationToken);
  }
}
