using OpenSystem.Core.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Reaction.Domain.Enums;
using OpenSystem.Core.Domain.ValueObjects;
using System.Globalization;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Reaction.Domain.Entities
{
  public class ReactionDetailEntity
    : SoftDeletedAuditableEntity
  {
    public ReactionTypes Type { get; set; }

    public string UserId { get; set; } = string.Empty;

    public Guid ReactionId { get; set; }

    public ReactionEntity Reaction { get; set; }

    protected async override ValueTask<AuditableEntity> InnerSetForCreateAsync(string createdBy,
      DateTimeOffset createdDateTime)
    {
      UserId ??= createdBy;
      return this;
    }
  }
}
