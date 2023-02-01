namespace OpenSystem.Core.Domain.Entities
{
    public interface IIndexed<T>
    {
      public T Id { get; set; }
   }
}
