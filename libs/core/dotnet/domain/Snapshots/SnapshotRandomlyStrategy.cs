using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Snapshots
{
    public class SnapshotRandomlyStrategy : ISnapshotStrategy
    {
        private static readonly Random Random = new Random();
        public const double DefaultChance = 0.01d;

        public static ISnapshotStrategy Default { get; } = With();

        public static ISnapshotStrategy With(double chance = DefaultChance)
        {
            return new SnapshotRandomlyStrategy(chance);
        }

        private readonly double _chance;

        private SnapshotRandomlyStrategy(double chance)
        {
            if (chance < 0.0d || chance > 1.0d)
                throw new ArgumentOutOfRangeException(
                    $"Chance '{chance}' must be between 0.0 and 1.0"
                );

            _chance = chance;
        }

        public Task<bool> ShouldCreateSnapshotAsync(
            ISnapshotAggregateRoot snapshotAggregateRoot,
            CancellationToken cancellationToken
        )
        {
            return Task.FromResult(Random.NextDouble() >= _chance);
        }
    }
}
