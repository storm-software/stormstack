using OpenSystem.Core.DotNet.Domain.ValueObjects;

namespace OpenSystem.Core.DotNet.Domain.Common
{
  /// <summary>
	/// An AuditableEntity base class that uses a Guid as it's Id value.
	/// </summary>
  public class GuidIndexedAuditableEntity : AuditableEntity
  {
    public new GuidEntityId? Id { get; init; }
  }
}
