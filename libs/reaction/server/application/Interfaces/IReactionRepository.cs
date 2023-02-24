using OpenSystem.Core.Application.Models;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Reaction.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using OpenSystem.Reaction.Application.Queries;
using OpenSystem.Core.Application.Models.Parameters;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Application.Models.DTOs;

namespace OpenSystem.Reaction.Application.Interfaces
{
    public interface IReactionRepository : IGenericRepository<ReactionEntity>
    {
        Task<(IEnumerable<ReactionEntity> Data,
          RecordsCount RecordsCount)> GetReactionsAsync(GetReactionsQuery requestParameters);

        Task<IEnumerable<ReactionCountRecord>> GetReactionsCountAsync(GetReactionsCountQuery requestParameters);

        Task<ReactionEntity?> GetByContentIdAsync(string contentId);

        Task<bool> UserHasReactedAsync(string contentId);
    }
}
