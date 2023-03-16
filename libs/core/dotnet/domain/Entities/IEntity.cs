namespace OpenSystem.Core.Domain.Entities
{
    public interface IEntity<T>
      : IIndexed<T>
    {
    }

    public interface IEntity
      : IEntity<Guid>
    {
    }
}
