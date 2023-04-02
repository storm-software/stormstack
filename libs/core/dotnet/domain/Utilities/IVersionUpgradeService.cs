using OpenSystem.Core.Domain.Attributes;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Utilities
{
    public interface IVersionUpgradeService<TAttribute, TDefinition, TVersionedType>
        where TAttribute : VersionAttribute
        where TDefinition : VersionDefinition
        where TVersionedType : IVersioned
    {
        Task<TVersionedType> UpgradeAsync(
            TVersionedType versionedType,
            CancellationToken cancellationToken
        );
    }
}
