using OpenSystem.Core.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Reaction.Domain.Enums;
using OpenSystem.Core.Domain.Extensions;
using System.Globalization;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Reaction.Domain.Entities
{
  public class ReactionEntity
    : AggregateRoot
  {
    public string ContentId { get; set; }

    public bool IsDisabled { get; set; } = false;

    public IList<ReactionDetailEntity> Details { get; set; } = new List<ReactionDetailEntity>();

    public async ValueTask<ReactionDetailEntity> AddDetailAsync(string userId,
      ReactionTypes type,
      DateTimeOffset dateTime)
    {
      var detail = new ReactionDetailEntity();
      detail.ReactionId = Id;
      detail.UserId = userId;
      detail.Type = type;

      await detail.SetForCreateAsync(userId,
        dateTime);
      Details.Add(detail);

      return detail;
    }

    protected async override ValueTask<AuditableEntity> InnerSetForCreateAsync(string createdBy,
      DateTimeOffset createdDateTime)
    {
      await Details.ForEachAsync(async (detail) => {
          detail.ReactionId = Id;
          await detail.SetForCreateAsync(createdBy,
            createdDateTime);
        });

      return this;
    }
  }
}
