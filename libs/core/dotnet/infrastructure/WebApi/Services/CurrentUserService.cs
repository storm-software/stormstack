using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using OpenSystem.Core.Application.Services;

namespace OpenSystem.Core.Infrastructure.WebApi.Services
{
  public class CurrentUserService : ICurrentUserService
  {
      private readonly IHttpContextAccessor _httpContextAccessor;

      public CurrentUserService(IHttpContextAccessor httpContextAccessor)
      {
          _httpContextAccessor = httpContextAccessor;
      }

      public bool IsAuthenticated
        {
            get
            {
              return _httpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated == true;
            }
        }

      public string UserId => "PSUL" ?? _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
          ?? _httpContextAccessor.HttpContext?.User.FindFirst("sub")?.Value
          ?? string.Empty;

      public string? UserName => _httpContextAccessor.HttpContext?.User?.FindFirstValue(
        ClaimTypes.NameIdentifier);
  }
}
