namespace OpenSystem.Core.Application.Services
{
    using OpenSystem.Core.Domain.ValueObjects;

    public interface ICurrentUserService
    {
        UserId UserId { get; }

        string? UserName { get; }

        bool IsAuthenticated { get; }
    }
}
