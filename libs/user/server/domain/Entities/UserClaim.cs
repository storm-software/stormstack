using OpenSystem.Core.Domain.Entities;

namespace OpenSystem.User.Domain.Entities
{
    public class UserClaim : Entity<Guid>
    {
        public string Type { get; set; }

        public string Value { get; set; }

        public UserEntity User { get; set; }
    }
}
