using Microsoft.AspNetCore.Identity;
using OpenSystem.Core.DotNet.Domain.ResultCodes;

namespace OpenSystem.Core.DotNet.Infrastructure.Extensions
{
  public static class IdentityResultExtensions
  {
      public static Result ToApplicationResult(this IdentityResult result)
      {
          return result.Succeeded
              ? Result.Success()
              : Result.Failure(typeof(ResultCodeSecurity),
                ResultCodeSecurity.IdentityVerificationFailure,
                result.Errors.Select(e => e.Description).ToList());
      }
  }
}
