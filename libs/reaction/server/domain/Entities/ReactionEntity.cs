using OpenSystem.Core.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Reaction.Domain.Enums;
using OpenSystem.Core.Domain.Extensions;
using System.Globalization;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Reaction.Domain.Entities
{
    public class ReactionEntity : AggregateRoot
    {
        public string ContentId { get; set; }

        public bool IsDisabled { get; set; } = false;

        public List<ReactionDetailEntity> Details { get; set; } = new List<ReactionDetailEntity>();

        public ValueTask<ReactionDetailEntity> AddDetailAsync(
            string userId,
            ReactionTypes type,
            DateTimeOffset dateTime
        )
        {
            var detail =
                Details.FirstOrDefault(d => d.UserId == userId) ?? new ReactionDetailEntity();

            detail.UserId = userId;
            detail.Type = type;

            // await detail.SetForCreateAsync(userId, dateTime);
            Details.Add(detail);
            return ValueTask.FromResult(detail);
        }

        public ValueTask<ReactionDetailEntity> AddDetailAsync(ReactionDetailEntity detail)
        {
            /*var existing =
                Details.FirstOrDefault(d => d.UserId == userId) ?? new ReactionDetailEntity();

            detail.UserId = userId;
            detail.Type = type;*/

            detail.ReactionId = Id;
            detail.Reaction = this;

            // await detail.SetForCreateAsync(userId, dateTime);
            Details.Add(detail);
            return ValueTask.FromResult(detail);
        }

        /*public async ValueTask<ReactionDetailEntity> RestoreDetailAsync(
            Guid id,
            string restoredBy,
            DateTimeOffset dateTime
        )
        {
            var detail = Details.First(d => d.Id == id);
            await detail.SetForRestoreAsync(restoredBy, dateTime);

            return detail;
        }*/
    }
}
