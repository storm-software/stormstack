using OpenSystem.Reaction.Domain.Entities;
using OpenSystem.Core.Domain.Repositories;

namespace OpenSystem.Reaction.Domain.Repositories
{
    public interface IReactionRepository : IBaseRepository<ReactionEntity>
    {
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
