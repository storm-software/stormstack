using System.Diagnostics;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;
using MediatR;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Core.Domain.ResultCodes
{
  [Serializable]
  public class FieldValidationResult
    : FieldResult
  {
    public FieldValidationSeverityTypes Severity { get; set; } = FieldValidationSeverityTypes.None;

    public static FieldValidationResult Failure(string fieldName,
      Type resultCodeType,
      int code,
      FieldValidationSeverityTypes severity = FieldValidationSeverityTypes.Error,
      string? detail = null)
    {
      return new FieldValidationResult(fieldName,
        resultCodeType,
        code,
        severity,
        detail);
    }

    protected FieldValidationResult(string fieldName,
      Type resultCodeType,
      int code,
      FieldValidationSeverityTypes severity = FieldValidationSeverityTypes.Error,
      string? detail = null)
      : base(fieldName,
        resultCodeType,
        code,
        detail)
    {
      Severity = severity;
    }

    protected FieldValidationResult(string fieldName,
      Exception exception,
      FieldValidationSeverityTypes severity = FieldValidationSeverityTypes.Error)
      : base(fieldName,
        exception)
    {
      Severity = severity;
    }

    protected override void InnerGetObjectData(SerializationInfo info,
      StreamingContext context)
    {
      info.AddValue("Severity",
        Severity);
    }
  }
}
