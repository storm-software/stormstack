using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Common
{
    public interface ICommandResult
      : IResult<ICommandResultData>
    {
      public IList<FieldValidationResult> Fields { get; set; }
    }
}
