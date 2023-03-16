namespace OpenSystem.Core.Application.Repositories
{
  public interface IBaseUnitOfWork
  {
    Task<IDisposable> BeginTransactionAsync(CancellationToken cancellationToken = default);

    Task CommitTransactionAsync(CancellationToken cancellationToken = default);

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
  }
}
