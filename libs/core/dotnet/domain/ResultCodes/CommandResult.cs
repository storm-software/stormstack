using System.Runtime.Serialization;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Core.Domain.ResultCodes
{
  [Serializable]
  public class CommandResult<TData>
    : Result<TData>
    where TData : class, IIndexed
  {
    public IList<FieldValidationResult> Fields { get; set; } = new List<FieldValidationResult>();

    protected CommandResult(IList<FieldValidationResult> fields)
      : base()
    {
      Fields = fields;
    }

    public static CommandResult<TData> Success(TData? data,
      IList<FieldValidationResult>? fields = null,
      string? message = null)
    {
      return new CommandResult<TData>(data,
        fields ?? new List<FieldValidationResult>(),
        message);
    }

    public static CommandResult<TData> Failure(Type resultCodeType,
      int code,
      IList<FieldValidationResult> fields,
      string? detail = null)
    {
      return new CommandResult<TData>(resultCodeType,
        code,
        fields,
        detail);
    }

    public static CommandResult<TData> Failure(string resultCodeType,
      int code,
      IList<FieldValidationResult> fields,
      string? detail = null)
    {
      return new CommandResult<TData>(resultCodeType,
        code,
        fields,
        detail);
    }

    protected CommandResult(TData data,
      IList<FieldValidationResult> fields,
      string? message = null)
        : base(data,
          message)
    {
      Fields = fields;
    }

    protected CommandResult(Type resultCodeType,
      int code,
      IList<FieldValidationResult> fields,
      string? detail = null)
      : base(resultCodeType,
        code,
        detail)
    {
      Fields = fields;
    }

    protected CommandResult(string resultCodeType,
      int code,
      IList<FieldValidationResult> fields,
      string? message = null)
      : base(resultCodeType,
        code,
        message)
    {
      Fields = fields;
    }

    protected CommandResult(IList<FieldValidationResult> fields,
      Exception exception)
      : base(exception)
    {
      Fields = fields;
    }

    public static implicit operator CommandResult<TData>(CommandResult result) => result.Failed
      ? CommandResult<TData>.Failure(result.ResultCodeType,
        result.Code,
        result.Fields ?? new List<FieldValidationResult>(),
        result.Detail)
      : CommandResult<TData>.Success((TData)result.Data,
        result.Fields ?? new List<FieldValidationResult>(),
        result.Message);

    public static implicit operator CommandResult(CommandResult<TData> result) => result.Failed
      ? CommandResult.Failure(result.ResultCodeType,
        result.Code,
        result.Fields ?? new List<FieldValidationResult>(),
        result.Detail)
      : CommandResult.Success(result.Data,
        result.Fields ?? new List<FieldValidationResult>(),
        result.Message);

    public CommandResult AddField(string fieldName,
      Type resultCodeType,
      int code,
      FieldValidationSeverityTypes severity = FieldValidationSeverityTypes.Error,
      string? detail = null)
    {
      Fields ??= new List<FieldValidationResult>();

      Fields.Add(FieldValidationResult.Failure(fieldName,
        resultCodeType,
        code,
        FieldValidationSeverityTypes.Error,
        detail
      ));

      return this;
    }

    protected override void InnerGetObjectData(SerializationInfo info,
      StreamingContext context)
    {
      base.InnerGetObjectData(info,
        context);

      info.AddValue("Fields",
        Fields);
    }

  }


  [Serializable]
    public class CommandResult
      : CommandResult<IIndexed>
    {
    public static new CommandResult Success(IIndexed data,
      IList<FieldValidationResult>? fields = null,
      string? message = null)
    {
      return new CommandResult(data,
        fields ?? new List<FieldValidationResult>(),
        message);
    }

    public static CommandResult Success(Guid id,
      IList<FieldValidationResult>? fields = null,
      string? message = null)
    {
      return new CommandResult(id,
        fields ?? new List<FieldValidationResult>(),
        message);
    }

    public static new CommandResult Failure(Type resultCodeType,
      int code,
      IList<FieldValidationResult> fields,
      string? detail = null)
    {
      return new CommandResult(resultCodeType,
        code,
        fields,
        detail);
    }

    public static new CommandResult Failure(Type resultCodeType,
      int code,
      string? detail = null)
    {
      return new CommandResult(resultCodeType,
        code,
        new List<FieldValidationResult>(),
        detail);
    }

    public static CommandResult Failure(IList<FieldValidationResult> fields,
      Exception exception)
    {
      return new CommandResult(fields,
        exception);
    }

    protected CommandResult(IList<FieldValidationResult> fields)
      : base(fields)
    {
    }

    protected CommandResult(Guid id,
      IList<FieldValidationResult> fields,
      string? message = null)
        : base(new Indexed { Id = id },
          fields,
          message)
    {
    }

    protected CommandResult(IIndexed data,
      IList<FieldValidationResult> fields,
      string? message = null)
        : base(data,
          fields,
          message)
    {
    }

    protected CommandResult(
      Type resultCodeType,
      int code,
      IList<FieldValidationResult> fields,
      string? detail = null)
      : base(resultCodeType,
        code,
        fields,
        detail)
    {
    }

    protected CommandResult(
      string resultCodeType,
      int code,
      IList<FieldValidationResult> fields,
      string? message = null)
      : base(resultCodeType,
        code,
        fields,
        message)
    {
    }

    protected CommandResult(IList<FieldValidationResult> fields,
      Exception exception)
      : base(fields,
        exception)
    {
      Fields = fields;
    }

    /*public static implicit operator CommandResult(Result<Entity> result) => result.Failed
      ? CommandResult<Entity>.Failure(result.ResultCodeType,
        result.Code,
        new List<FieldValidationResult>(),
        result.Detail)
      : CommandResult<Entity>.Success(result.Data,
        new List<FieldValidationResult>(),
        result.Message);

    public static implicit operator CommandResult(Result<object> result) => result.Failed
      ? CommandResult.Failure(result.ResultCodeType,
        result.Code,
        new List<FieldValidationResult>(),
        result.Detail)
      : CommandResult.Success((IIndexed)result.Data,
        new List<FieldValidationResult>(),
        result.Message);

    public static implicit operator CommandResult(Result<SoftDeletedAuditableEntity> result) => result.Failed
      ? CommandResult.Failure(result.ResultCodeType,
        result.Code,
        new List<FieldValidationResult>(),
        result.Detail)
      : CommandResult.Success((IIndexed)result.Data,
        new List<FieldValidationResult>(),
        result.Message);

    public static implicit operator CommandResult(Result<AuditableEntity> result) => result.Failed
      ? CommandResult.Failure(result.ResultCodeType,
        result.Code,
        new List<FieldValidationResult>(),
        result.Detail)
      : CommandResult.Success((IIndexed)result.Data,
        new List<FieldValidationResult>(),
        result.Message);


    public static implicit operator CommandResult(CommandResult<AggregateRoot> v)
    {
      throw new NotImplementedException();
    }

     public static implicit operator CommandResult(CommandResult<IIndexed> result)=> result.Failed
       ? CommandResult<IIndexed>.Failure(result.ResultCodeType,
         result.Code,
         result.Detail) as CommandResult<IIndexed>
       : CommandResult<IIndexed>.Success((IIndexed)result.Data,
         result.Message) as CommandResult<IIndexed>;


     public static explicit  operator CommandResult<IIndexed>(Result result) => (CommandResult<IIndexed>)(result.Failed
       ? CommandResult<IIndexed>.Failure(result.ResultCodeType,
         result.Code,
         result.Detail)
       : CommandResult<IIndexed>.Success((IIndexed)result.Data,
         result.Message));

     public static implicit operator Result(CommandResult<IIndexed> result) => result.Failed
       ? Result.Failure(result.ResultCodeType,
         result.Code,
         result.Detail)
       : Result.Success(result.Data,
         result.Message);*/
  }
}
