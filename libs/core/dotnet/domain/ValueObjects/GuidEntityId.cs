namespace OpenSystem.Core.DotNet.Domain.ValueObjects
{
	public class GuidEntityId
    : EntityId<Guid>
	{
    protected GuidEntityId(Guid value)
      : base(value)
    {
      Value = value;
    }
  }
}
