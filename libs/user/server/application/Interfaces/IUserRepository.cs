using OpenSystem.Core.Application.Models;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.User.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using OpenSystem.User.Application.Queries.GetUsers;
using OpenSystem.Core.Application.Models.Parameters;
using OpenSystem.Core.Domain.Entities;

namespace OpenSystem.User.Application.Interfaces
{
    public interface IUserRepository : IGenericRepository<UserEntity>
    {
        Task<bool> IsUniqueUserIdAsync(Guid userId);

        Task<(IEnumerable<UserEntity> data,
          RecordsCount recordsCount)> GetUsersAsync(GetUsersQuery requestParameters);
    }
}
