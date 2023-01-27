namespace OpenSystem.Core.DotNet.Application.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T> GetByGuidAsync(Guid guid);

        Task<IEnumerable<T>> GetAllAsync();

        Task<IEnumerable<T>> GetPagedResultAsync(int pageNumber,
          int pageSize);

        Task<IEnumerable<T>> GetPagedAdvancedResultAsync(int pageNumber,
          int pageSize,
          string orderBy,
          string fields);

        Task<T> AddAsync(T entity);

        Task UpdateAsync(T entity);

        Task DeleteAsync(T entity);
    }
}
