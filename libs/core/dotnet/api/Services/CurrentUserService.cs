using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using OpenSystem.Core.Application.Services;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Api.Services
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
            get { return _httpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated == true; }
        }

        /*public UserId UserId =>
            UserId.With(
                "PSUL"
                    ?? _httpContextAccessor.HttpContext?.User
                        .FindFirst(ClaimTypes.NameIdentifier)
                        ?.Value
                    ?? _httpContextAccessor.HttpContext?.User.FindFirst("sub")?.Value
                    ?? string.Empty
            );*/

        public UserId UserId => UserId.With("PSUL");

        public string? UserName =>
            _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}
