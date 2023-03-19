namespace OpenSystem.Core.Domain.Common
{
  public interface IIndexed<T>
  {
    public T Id { get; set; }
  }

  public interface IIndexed
    : IIndexed<Guid>
  {
  }
}
