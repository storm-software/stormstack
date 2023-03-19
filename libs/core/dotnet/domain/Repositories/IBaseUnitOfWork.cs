namespace OpenSystem.Core.Domain.Repositories
{
  public interface IBaseUnitOfWork
  {
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
  }
}
