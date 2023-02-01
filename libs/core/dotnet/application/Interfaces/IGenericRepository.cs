namespace OpenSystem.Core.Application.Interfaces
{
  public interface IGenericRepository<T> where T : class
    {
        Task<T> GetByIdAsync(Guid id);

        Task<IEnumerable<T>> GetAllAsync();

        Task<IEnumerable<T>> GetPagedResponseAsync(int pageNumber,
          int pageSize);

        Task<IEnumerable<T>> GetPagedAdvancedResponseAsync(int pageNumber,
          int pageSize,
          string orderBy,
          string fields);

        Task<T> AddAsync(T entity);

        Task UpdateAsync(T entity);

        Task DeleteAsync(T entity);
    }
}
