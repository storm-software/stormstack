using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Utilities
{
    public interface IVersionUpgrader<in TFrom, TTo>
        where TFrom : IVersioned
        where TTo : IVersioned
    {
        Task<TTo> UpgradeAsync(TFrom fromVersionedType, CancellationToken cancellationToken);
    }
}
