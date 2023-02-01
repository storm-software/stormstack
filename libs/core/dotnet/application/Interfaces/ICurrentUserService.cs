namespace OpenSystem.Core.Application.Interfaces
{
  public interface ICurrentUserService
  {
      string UserId { get; }

      string? UserName { get; }

      bool IsAuthenticated { get; }
  }
}
