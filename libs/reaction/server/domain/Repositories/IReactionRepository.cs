using OpenSystem.Reaction.Domain.Entities;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Repositories;

namespace OpenSystem.Reaction.Domain.Repositories
{
    public interface IReactionRepository : IBaseRepository<ReactionEntity>
    {
        Task<Paged<ReactionEntity>> GetReactionsAsync(
            string? contentId,
            string? type,
            int? pageSize = 0,
            int? pageNumber = 0,
            string? orderBy = null,
            string? fields = null
        );

        Task<IList<(string Type, int Count)>> GetReactionsCountAsync(
            string contentId,
            string? type
        );

        Task<ReactionEntity?> GetByContentIdAsync(string contentId);

        Task<bool> UserHasReactedAsync(string contentId);

        ValueTask<ReactionDetailEntity> AddOrUpdateDetailAsync(
            Guid ReactionId,
            string userId,
            CancellationToken cancellationToken = default,
            bool? includeRemoved = false
        );

        ValueTask<ReactionDetailEntity> DeleteDetailAsync(
            ReactionDetailEntity detail,
            CancellationToken cancellationToken = default
        );

        ValueTask<ReactionDetailEntity> RestoreDetailAsync(
            ReactionDetailEntity detail,
            CancellationToken cancellationToken = default
        );
    }
}
