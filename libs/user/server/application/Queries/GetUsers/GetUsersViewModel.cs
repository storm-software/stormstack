using OpenSystem.User.Domain.Enums;
using System;

namespace OpenSystem.User.Application.Queries.GetUsers
{
 public class GetUsersViewModel
    {
        public Guid Id { get; set; }

        public string UserId { get; set; }

        public string Name { get; set; }

        public UserTypes Type { get; set; }

        public UserStatusTypes Status { get; set; }

        public string? Description { get; set; }

        public string Email { get; set; }

        public string Culture { get; set; }
    }
}
