using OpenSystem.Core.Domain.Entities;

namespace OpenSystem.User.Domain.Entities
{
    public class UserRole : Entity<Guid>, IAggregateRoot
    {
        public Guid UserId { get; set; }

        public Guid RoleId { get; set; }

        public UserEntity User { get; set; }

        public Role Role { get; set; }
    }
}
