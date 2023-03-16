namespace OpenSystem.Core.Domain.Entities
{
    public interface ISoftDeleted
    {
        public string? DeletedBy { get; set; }

        public DateTimeOffset? DeletedDateTime { get; set; }
    }
}
