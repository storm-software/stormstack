using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Core.Domain.Settings
{
    public interface ICancellationSettings
    {
        CancellationBoundaryTypes CancellationBoundary { get; }
    }
}
