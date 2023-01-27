using OpenSystem.Core.DotNet.Domain.ValueObjects;

namespace OpenSystem.Core.DotNet.Domain.Common
{
  /// <summary>
	/// An AuditableBaseEntity base class that uses a string as it's Id value.
	/// </summary>
  public abstract class StringIndexedAuditableBaseEntity
    : AuditableBaseEntity<EntityId<string>, string>
  {
  }
}
