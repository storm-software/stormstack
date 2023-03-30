namespace OpenSystem.Core.Domain.ReadStores
{
    public interface IListReadModel<TData> : IReadModel
    {
        List<TData> Data { get; set; }
    }
}
