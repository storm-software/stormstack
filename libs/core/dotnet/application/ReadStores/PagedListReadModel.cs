namespace OpenSystem.Core.Application.ReadStores
{
    public class PagedListReadModel<TData> : ReadModel, IListReadModel<TData>
    {
        public List<TData> Data { get; set; }
    }
}
