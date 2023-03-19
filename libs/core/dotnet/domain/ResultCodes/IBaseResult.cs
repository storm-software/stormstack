namespace OpenSystem.Core.Domain.Common
{
    public interface IBaseResult
    {
      public int Code { get; set; }

      public string ResultCodeType { get; set; }

      public bool Succeeded { get; set; }

      public bool Failed => !Succeeded;

      public string? Message { get; set; }

      public string? Detail { get; set; }

      public string? HelpLink { get; set; }

      public string? StackTrace { get; set; }
    }
}
