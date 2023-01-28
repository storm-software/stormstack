using OpenSystem.Core.DotNet.Domain.ValueObjects;

namespace OpenSystem.Core.DotNet.Domain.Common
{
  /// <summary>
	/// An AuditableEntity base class that uses a string as it's Id value.
	/// </summary>
  public class StringIndexedAuditableEntity : AuditableEntity
  {
    public new StringEntityId? Id { get; init; }
  }
}
