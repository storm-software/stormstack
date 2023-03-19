using OpenSystem.Core.Domain.Entities;

namespace OpenSystem.Core.Domain.Repositories
{
   public interface IBaseDbContext<TEntity> : IBaseUnitOfWork
      where TEntity : AggregateRoot
  {
  }
}
