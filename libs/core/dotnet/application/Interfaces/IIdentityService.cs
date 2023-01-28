using System;
using OpenSystem.Core.DotNet.Application.Models;
using OpenSystem.Core.DotNet.Domain.ResultCodes;

namespace OpenSystem.Core.DotNet.Application.Interfaces
{
  public interface IIdentityService
  {
      Task<string?> GetUserNameAsync(string userId);

      Task<bool> IsInRoleAsync(string userId, string role);

      Task<bool> AuthorizeAsync(string userId, string policyName);

      Task<(Result Result, string UserId)> CreateUserAsync(string userName,
        string password);

      Task<Result> DeleteUserAsync(string userId);
  }
}
