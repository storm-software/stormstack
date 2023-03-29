using System.Text.RegularExpressions;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Utilities
{
    public interface IRetryStrategy
    {
        Retry ShouldThisBeRetried(
            Exception exception,
            TimeSpan totalExecutionTime,
            int currentRetryCount
        );
    }
}
