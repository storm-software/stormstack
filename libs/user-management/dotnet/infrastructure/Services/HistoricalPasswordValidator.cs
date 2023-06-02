using OpenSystem.User.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace OpenSystem.User.Infrastructure.Services
{
    public class HistoricalPasswordValidator : IPasswordValidator<UserEntity>
    {
        public Task<IdentityResult> ValidateAsync(UserManager<UserEntity> manager,
          UserEntity user, string password)
        {
            if (password.Contains("testhistoricalpassword"))
            {
                return Task.FromResult(IdentityResult.Failed(new IdentityError
                {
                    Code = "HistoricalPassword",
                    Description = "HistoricalPasswordValidator testing.",
                }));
            }

            return Task.FromResult(IdentityResult.Success);
        }
  }
}
