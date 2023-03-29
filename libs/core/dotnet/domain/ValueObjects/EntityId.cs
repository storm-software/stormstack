namespace OpenSystem.Core.Domain.ValueObjects
{
    public class EntityId : Identity<EntityId>
    {
        public EntityId(string value)
            : base(value) { }

        public static implicit operator EntityId(string guid) => guid;

        public static implicit operator string(EntityId entityId) => entityId.Value;
    }
}
