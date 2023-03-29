using FluentValidation.Results;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Common
{
    public interface IResult<T> : IBaseResult
    {
        public T? Data { get; set; }

        public string? HelpLink { get; set; }

        public List<ValidationFailure> Fields { get; init; }
    }
}
