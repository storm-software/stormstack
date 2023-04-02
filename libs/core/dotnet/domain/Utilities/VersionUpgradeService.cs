using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Attributes;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Utilities
{
    public abstract class VersionUpgradeService<
        TAttribute,
        TDefinition,
        TVersionedType,
        TDefinitionService
    > : IVersionUpgradeService<TAttribute, TDefinition, TVersionedType>
        where TAttribute : VersionAttribute
        where TDefinition : VersionDefinition
        where TVersionedType : IVersioned
        where TDefinitionService : IVersionDefinitionService<TAttribute, TDefinition>
    {
        private readonly ILogger<
            VersionUpgradeService<TAttribute, TDefinition, TVersionedType, TDefinitionService>
        > _logger;

        private readonly IServiceProvider _serviceProvider;

        private readonly TDefinitionService _definitionService;

        protected VersionUpgradeService(
            ILogger<
                VersionUpgradeService<TAttribute, TDefinition, TVersionedType, TDefinitionService>
            > logger,
            IServiceProvider serviceProvider,
            TDefinitionService definitionService
        )
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
            _definitionService = definitionService;
        }

        public async Task<TVersionedType> UpgradeAsync(
            TVersionedType versionedType,
            CancellationToken cancellationToken
        )
        {
            var currentDefinition = _definitionService.GetDefinition(versionedType.GetType());
            var definitionsWithHigherVersion = _definitionService
                .GetDefinitions(currentDefinition.Name)
                .Where(d => d.Version > currentDefinition.Version)
                .OrderBy(d => d.Version)
                .ToList();

            if (!definitionsWithHigherVersion.Any())
            {
                _logger.LogTrace(
                    "No need to update {VersionedType} as its already the correct version",
                    versionedType.GetType().PrettyPrint()
                );
                return versionedType;
            }

            if (_logger.IsEnabled(LogLevel.Trace))
            {
                _logger.LogTrace(
                    "Versioned type {VersionedType} v{Version} needs to be upgraded to v{ExpectedVersion}",
                    currentDefinition.Name,
                    currentDefinition.Version,
                    definitionsWithHigherVersion.Last().Version
                );
            }

            foreach (var nextDefinition in definitionsWithHigherVersion)
            {
                versionedType = await UpgradeToVersionAsync(
                        versionedType,
                        currentDefinition,
                        nextDefinition,
                        cancellationToken
                    )
                    .ConfigureAwait(false);
                currentDefinition = nextDefinition;
            }

            return versionedType;
        }

        protected abstract Type CreateUpgraderType(Type fromType, Type toType);

        private async Task<TVersionedType> UpgradeToVersionAsync(
            TVersionedType versionedType,
            TDefinition fromDefinition,
            TDefinition toDefinition,
            CancellationToken cancellationToken
        )
        {
            _logger.LogTrace(
                "Upgrading {FromDefinition} to {ToDefinition}",
                fromDefinition,
                toDefinition
            );

            var upgraderType = CreateUpgraderType(fromDefinition.Type, toDefinition.Type);
            var versionedTypeUpgraderType = typeof(IVersionUpgrader<,>).MakeGenericType(
                fromDefinition.Type,
                toDefinition.Type
            );
            var versionedTypeUpgrader = _serviceProvider.GetRequiredService(upgraderType);

            var methodInfo = versionedTypeUpgraderType.GetTypeInfo().GetMethod("UpgradeAsync");

            var task = (Task)
                methodInfo.Invoke(
                    versionedTypeUpgrader,
                    new object[] { versionedType, cancellationToken }
                );

            await task.ConfigureAwait(false);

            return ((dynamic)task).Result;
        }
    }
}
