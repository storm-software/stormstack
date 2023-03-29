namespace OpenSystem.Core.Domain.ReadStores
{
    public class ReadModelContextFactory : IReadModelContextFactory
    {
        private readonly IServiceProvider _serviceProvider;

        public ReadModelContextFactory(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public IReadModelContext Create(string readModelId, bool isNew)
        {
            return new ReadModelContext(_serviceProvider, readModelId, isNew);
        }
    }
}
