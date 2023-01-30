using OpenSystem.Core.DotNet.Application.Models;
using OpenSystem.Core.DotNet.Application.Interfaces;
using OpenSystem.User.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using OpenSystem.User.Application.Queries.GetUsers;
using OpenSystem.Core.DotNet.Application.Models.Parameters;
using OpenSystem.Core.DotNet.Domain.Entities;

namespace OpenSystem.User.Application.Interfaces
{
    public interface IUserRepository : IGenericRepository<UserEntity>
    {
        Task<bool> IsUniqueUserIdAsync(string userId);

        Task<(IEnumerable<Entity> data,
          RecordsCount recordsCount)> GetUsersAsync(GetUsersQuery requestParameters);
    }
}
