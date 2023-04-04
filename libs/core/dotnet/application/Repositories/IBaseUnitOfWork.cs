namespace OpenSystem.Core.Application.Repositories
{
    public interface IBaseUnitOfWork
    {
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
