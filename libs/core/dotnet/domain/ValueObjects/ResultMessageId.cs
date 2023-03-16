using System.ComponentModel.DataAnnotations;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.ValueObjects
{
	public class ResultMessagePrimaryKey
    : ValueObject<ResultMessageKeyFields, ResultMessagePrimaryKey>
	{  
    public static ResultMessagePrimaryKey Create(string? ResultCodeType,
      int code)
    {
        return ResultMessagePrimaryKey.Create(new ResultMessageKeyFields(ResultCodeType,
          code));
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value.ResultCodeType;
        yield return Value.Code;
    }

    protected override Result InnerValidate()
    {
      var ret = base.InnerValidate();
      if (ret.Failed)
        return ret;

      if (Value == null ||
        Value.ResultCodeType == null ||
        !Value.Code.IsSet())
        return Result.Failure(typeof(ResultCodeValidation),
            ResultCodeValidation.IdentifierCannotBeNull);

      return Result.Success();
    }
	}

  public class ResultMessageKeyFields
  {
    public string? ResultCodeType;

    public int Code;

    public ResultMessageKeyFields(string? resultCodeType,
      int code)
    {
        ResultCodeType = resultCodeType;
        Code = code;
    }
  }
}
