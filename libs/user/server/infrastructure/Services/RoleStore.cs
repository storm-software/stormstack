using OpenSystem.User.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace OpenSystem.User.Infrastructure.Services
{
public class RoleStore : IRoleStore<Role>
    {
        // private readonly IRoleRepository _roleRepository;

        public RoleStore()
        {
            // _roleRepository = roleRepository;
        }

        public void Dispose()
        {

        }

        public Task<IdentityResult> CreateAsync(Role role,
          CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<IdentityResult> DeleteAsync(Role role,
          CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<Role> FindByIdAsync(string roleId,
          CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<Role> FindByNameAsync(string normalizedRoleName,
          CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<string> GetNormalizedRoleNameAsync(Role role,
          CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<string> GetRoleIdAsync(Role role,
          CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<string> GetRoleNameAsync(Role role,
          CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task SetNormalizedRoleNameAsync(Role role,
          string normalizedName,
          CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task SetRoleNameAsync(Role role,
          string roleName,
          CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<IdentityResult> UpdateAsync(Role role,
          CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
