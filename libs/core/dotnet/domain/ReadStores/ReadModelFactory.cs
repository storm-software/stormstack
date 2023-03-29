using System.Reflection;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Domain.ReadStores
{
    public class ReadModelFactory<TReadModel> : IReadModelFactory<TReadModel>
        where TReadModel : IReadModel
    {
        private readonly ILogger<ReadModelFactory<TReadModel>> _logger;

        private static Func<TReadModel> _createReadModelFunc;

        static ReadModelFactory()
        {
            var type = typeof(TReadModel).GetTypeInfo();

            var emptyConstructor = type.GetConstructors()
                .Where(c => !c.GetParameters().Any())
                .ToList();

            if (!emptyConstructor.Any())
            {
                throw new ArgumentException(
                    $"Read model type '{typeof(TReadModel).PrettyPrint()}' doesn't have an empty "
                        + $"constructor. Please create a custom '{typeof(IReadModelFactory<TReadModel>).PrettyPrint()}' "
                        + "implementation."
                );
            }
        }

        public ReadModelFactory(ILogger<ReadModelFactory<TReadModel>> logger)
        {
            _logger = logger;
        }

        public Task<TReadModel> CreateAsync(string id, CancellationToken cancellationToken)
        {
            if (_logger.IsEnabled(LogLevel.Trace))
            {
                _logger.LogTrace(
                    "Creating new instance of read model type {ReadModelType} with ID {Id}",
                    typeof(TReadModel).PrettyPrint(),
                    id
                );
            }

            _createReadModelFunc ??= ReflectionHelper.CompileConstructor<TReadModel>();
            return Task.FromResult(_createReadModelFunc());
        }
    }
}
