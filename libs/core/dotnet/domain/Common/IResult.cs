namespace OpenSystem.Core.Domain.Common
{
    public interface IResult<T>
    {
      public int Code { get; set; }

      public string ResultCodeType { get; set; }

      public bool Succeeded { get; set; }

      public bool Failed => !Succeeded;

      public string? Message { get; set; }

      public List<string>? Details { get; set; }

      public string? HelpLink { get; set; }

      public string? StackTrace { get; set; }

      public T? Data { get; set; }
    }
}
