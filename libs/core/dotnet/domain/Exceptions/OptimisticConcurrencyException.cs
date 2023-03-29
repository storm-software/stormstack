using FluentValidation.Results;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Exceptions
{
    public class OptimisticConcurrencyException : GeneralProcessingException
    {
        public OptimisticConcurrencyException(
            string? extendedMessage = null,
            Exception? exception = null
        )
            : base(
                typeof(ResultCodeApplication),
                ResultCodeApplication.OptimisticConcurrencyFailure,
                extendedMessage,
                exception
            ) { }
    }
}
