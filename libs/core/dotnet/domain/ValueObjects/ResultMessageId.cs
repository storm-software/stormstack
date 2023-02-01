using System.ComponentModel.DataAnnotations;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.ValueObjects
{
	public class ResultMessageId
    : EntityId<ResultMessageKey>
	{
    protected ResultMessageId(ResultMessageKey value)
      : base(value)
    {
    }

		public static ResultMessageId Create(Type resultCodeType,
          int code)
		{
      return new ResultMessageId(new ResultMessageKey(resultCodeType.FullName,
          code));
		}

    public override IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
      if (Value == null ||
        Value.ResultCodeType == null ||
        !Value.Code.IsSet())
      {
          yield return GetValidationResult(typeof(ResultCodeValidation),
            ResultCodeValidation.IdentifierCannotBeNull);
      }
    }
	}

  public class ResultMessageKey
  {
    public string? ResultCodeType;

    public int Code;

    public ResultMessageKey(string? resultCodeType,
      int code)
    {
        ResultCodeType = resultCodeType;
        Code = code;
    }
  }
}
