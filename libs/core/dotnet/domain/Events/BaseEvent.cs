namespace OpenSystem.Core.Domain.Events
{
  public abstract class BaseEvent
  {
    public Guid Id { get; private set; }

    public DateTimeOffset CreationDate { get; private set; }

    public BaseEvent()
    {
        Id = Guid.NewGuid();
        CreationDate = DateTimeOffset.UtcNow;
    }

    public BaseEvent(Guid id,
      DateTimeOffset createDate)
    {
        Id = id;
        CreationDate = createDate;
    }
  }
}
