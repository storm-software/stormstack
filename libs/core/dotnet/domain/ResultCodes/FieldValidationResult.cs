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

    protected FieldValidationResult(FieldValidationSeverityTypes severity,
      string fieldName)
      : base(fieldName)
    {
      Severity = severity;
    }

    protected FieldValidationResult(FieldValidationSeverityTypes severity,
      string fieldName,
      string? message = null)
        : base(fieldName,
          message)
    {
      Severity = severity;
    }

    protected FieldValidationResult(FieldValidationSeverityTypes severity,
      string fieldName,
      Type resultCodeType,
      int code,
      string? details = null)
      : base(fieldName,
        resultCodeType,
        code,
        details)
    {
      Severity = severity;
    }

    protected FieldValidationResult(FieldValidationSeverityTypes severity,
      string fieldName,
      string resultCodeType,
      int code,
      string? message = null)
      : base(fieldName,
        resultCodeType,
        code,
        message)
    {
      Severity = severity;
    }

    protected FieldValidationResult(FieldValidationSeverityTypes severity,
      string fieldName,
      Exception exception)
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
