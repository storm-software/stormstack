namespace OpenSystem.Core.Domain.Common
{
    public class Indexed<T> : IIndexed<T>
    {
        public T Id { get; set; }
    }

    public class Indexed : Indexed<Guid>, IIndexed { }
}
