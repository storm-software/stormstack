namespace OpenSystem.Core.Domain.Entities
{
  public interface IConcurrencyStamped
  {
    string? ConcurrencyStamp { get; set; }
  }
}
