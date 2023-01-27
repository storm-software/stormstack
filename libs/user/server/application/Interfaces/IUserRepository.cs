using OpenSystem.User.Application.Queries.GetUsers;
using OpenSystem.User.Application.Parameters;
using OpenSystem.Core.DotNet.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OpenSystem.User.Application.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<bool> IsUserUniqueAsync(string positionNumber);

        Task<(IEnumerable<Entity> data, RecordsCount recordsCount)> GetUsersAsync(GetUsersQuery requestParameters);
    }
}
