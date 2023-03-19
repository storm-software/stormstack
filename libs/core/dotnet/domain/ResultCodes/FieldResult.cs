using System.Diagnostics;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;
using MediatR;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.ResultCodes
{
  [Serializable]
  public class FieldResult
    : BaseResult
  {
    public string FieldName { get; set; }

    protected FieldResult(string fieldName)
      : base()
    {
      FieldName = fieldName;
    }

    protected FieldResult(string fieldName,
      string? message = null)
        : base(message)
    {
      FieldName = fieldName;
    }

    protected FieldResult(string fieldName,
      Type resultCodeType,
      int code,
      string? detail = null)
      : base(resultCodeType,
        code,
        detail)
    {
      FieldName = fieldName;
    }

    protected FieldResult(string fieldName,
      string resultCodeType,
      int code,
      string? message = null)
      : base(resultCodeType,
        code,
        message)
    {
      FieldName = fieldName;
    }

    protected FieldResult(string fieldName,
      Exception exception)
      : base(exception)
    {
      FieldName = fieldName;
    }

    protected override void InnerGetObjectData(SerializationInfo info,
      StreamingContext context)
    {
      base.InnerGetObjectData(info,
        context);

      info.AddValue("FieldName",
        FieldName);
    }
  }
}
