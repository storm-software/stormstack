using OpenSystem.Reaction.Domain.Entities;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Repositories;

namespace OpenSystem.Reaction.Domain.Repositories
{
  public interface IReactionRepository
    : IBaseRepository<ReactionEntity>
  {
    Task<PagedResult<ReactionEntity>> GetReactionsAsync(string? contentId,
      string? type,
      int? pageSize = 0,
      int? pageNumber = 0,
      string? orderBy = null,
      string? fields = null);

    Task<PagedResult<(string Type, int Count)>> GetReactionsCountAsync(string? contentId,
      string? type,
      int? pageSize = 0,
      int? pageNumber = 0,
      string? orderBy = null,
      string? fields = null);

    Task<ReactionEntity?> GetByContentIdAsync(string contentId);

    Task<bool> UserHasReactedAsync(string contentId);
  }
}
