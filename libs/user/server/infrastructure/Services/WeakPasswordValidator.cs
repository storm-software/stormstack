using OpenSystem.User.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace OpenSystem.User.Infrastructure.Services
{
    public class WeakPasswordValidator : IPasswordValidator<UserEntity>
    {
        public Task<IdentityResult> ValidateAsync(UserManager<UserEntity> manager,
          UserEntity user, string password)
        {
            if (password.Contains("testweakpassword"))
            {
                return Task.FromResult(IdentityResult.Failed(new IdentityError
                {
                    Code = "WeakPassword",
                    Description = "WeakPasswordValidator testing.",
                }));
            }

            return Task.FromResult(IdentityResult.Success);
        }
  }
}
