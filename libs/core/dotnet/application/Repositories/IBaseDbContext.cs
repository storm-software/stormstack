using OpenSystem.Core.Domain.Entities;

namespace OpenSystem.Core.Application.Repositories
{
   public interface IBaseDbContext<TEntity>
      where TEntity : AuditableEntity, IAggregateRoot
  {
      Task<int> SaveChangesAsync(CancellationToken cancellationToken);
  }
}
