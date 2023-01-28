using OpenSystem.Core.DotNet.Domain.Common;

namespace OpenSystem.Core.DotNet.Domain.Events
{
  public class IntegrationEvent : BaseEvent
  {
    public string OriginatingDomain { get; private set; }

    public IntegrationEvent(string originatingDomain)
      : base()
    {
        OriginatingDomain = originatingDomain;
    }

    public IntegrationEvent(Guid id,
      DateTimeOffset createDate,
      string originatingDomain)
        : base(id,
          createDate)
    {
      OriginatingDomain = originatingDomain;
    }
  }
}
