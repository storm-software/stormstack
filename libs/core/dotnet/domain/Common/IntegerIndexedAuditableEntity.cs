using OpenSystem.Core.DotNet.Domain.ValueObjects;

namespace OpenSystem.Core.DotNet.Domain.Common
{
  /// <summary>
	/// An AuditableEntity base class that uses a integer as it's Id value.
	/// </summary>
  public class IntegerIndexedAuditableEntity : AuditableEntity
  {
    public new IntegerEntityId? Id { get; init; }
  }
}
