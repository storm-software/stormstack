namespace OpenSystem.Core.Application.ReadStores
{
    public interface IListReadModel<TData> : IReadModel
    {
        List<TData> Data { get; set; }
    }
}
