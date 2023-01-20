using OpenSystem.Core.DotNet.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OpenSystem.Core.DotNet.Application.Interfaces
{
    public interface IDataShapeHelper<T>
    {
        IEnumerable<Entity> ShapeData(IEnumerable<T> entities,
          string fieldsString);

        Task<IEnumerable<Entity>> ShapeDataAsync(IEnumerable<T> entities,
          string fieldsString);

        Entity ShapeData(T entity,
          string fieldsString);
    }
}
