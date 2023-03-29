using System.Text.RegularExpressions;

namespace OpenSystem.Core.Domain.Utilities
{
    public interface ITransientFaultHandler<out TRetryStrategy>
        where TRetryStrategy : IRetryStrategy
    {
        void ConfigureRetryStrategy(Action<TRetryStrategy> configureStrategy);

        Task TryAsync(
            Func<CancellationToken, Task> action,
            Label label,
            CancellationToken cancellationToken
        );

        Task<T> TryAsync<T>(
            Func<CancellationToken, Task<T>> action,
            Label label,
            CancellationToken cancellationToken
        );
    }
}
