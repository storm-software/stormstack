using Microsoft.AspNetCore.Identity;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Infrastructure.Extensions
{
  public static class IdentityResultExtensions
  {
      public static Result ToApplicationResult(this IdentityResult result)
      {
          return result.Succeeded
            ? Result.Success()
            : Result.Failure(typeof(ResultCodeSecurity),
              ResultCodeSecurity.IdentityVerificationFailure);
      }
  }
}
