namespace OpenSystem.Core.Application.Interfaces
{
   public interface IApplicationDbContext
  {
      Task<int> SaveChangesAsync(CancellationToken cancellationToken);
  }
}
