using OpenSystem.Core.DotNet.Domain.ValueObjects;

namespace OpenSystem.Core.DotNet.Domain.Common
{
  /// <summary>
	/// An AuditableBaseEntity base class that uses a integer as it's Id value.
	/// </summary>
  public abstract class IntegerIndexedAuditableBaseEntity
    : AuditableBaseEntity<EntityId<int>, int>
  {
  }
}
