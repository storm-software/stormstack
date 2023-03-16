using OpenSystem.Reaction.Domain.Entities;
using OpenSystem.Core.Application.Models.Parameters;
using OpenSystem.Core.Application.Repositories;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Application.Models.DTOs;

namespace OpenSystem.Reaction.Application.Interfaces
{
    public interface IReactionRepository : IBaseRepository<ReactionEntity>
    {
        Task<(IEnumerable<ReactionEntity> Data,
          RecordsCount RecordsCount)> GetReactionsAsync(GetReactionsQuery requestParameters);

        Task<IEnumerable<ReactionCountRecord>> GetReactionsCountAsync(GetReactionsCountQuery requestParameters);

        Task<ReactionEntity?> GetByContentIdAsync(string contentId);

        Task<bool> UserHasReactedAsync(string contentId);
    }
}
