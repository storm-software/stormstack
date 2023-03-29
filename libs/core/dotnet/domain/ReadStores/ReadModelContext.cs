namespace OpenSystem.Core.Domain.ReadStores
{
    public class ReadModelContext : IReadModelContext
    {
        public bool IsMarkedForDeletion { get; private set; }

        public bool IsNew { get; }

        public IServiceProvider ServiceProvider { get; }

        public string ReadModelId { get; }

        public ReadModelContext(IServiceProvider serviceProvider, string readModelId, bool isNew)
        {
            ServiceProvider = serviceProvider;
            ReadModelId = readModelId;
            IsNew = isNew;
        }

        public void MarkForDeletion()
        {
            IsMarkedForDeletion = true;
        }
    }
}
