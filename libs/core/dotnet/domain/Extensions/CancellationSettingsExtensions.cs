using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Settings;

namespace OpenSystem.Core.Domain.Extensions
{
    public static class CancellationSettingsExtensions
    {
        public static CancellationToken Limit(
            this ICancellationSettings configuration,
            CancellationToken token,
            CancellationBoundaryTypes currentBoundary
        )
        {
            token.ThrowIfCancellationRequested();
            return currentBoundary < configuration.CancellationBoundary
                ? token
                : CancellationToken.None;
        }
    }
}
