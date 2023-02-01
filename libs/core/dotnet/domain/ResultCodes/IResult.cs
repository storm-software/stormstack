namespace OpenSystem.Core.Domain.ResultCodes
{
    public interface IResult<T>
    {
      public bool Succeeded { get; set; }

      public bool Failed => !Succeeded;

      public string? Message { get; set; }

      public List<string>? Details { get; set; }

      public string? HelpLink { get; set; }

      public string? StackTrace { get; set; }

      public T? Data { get; set; }
    }
}
