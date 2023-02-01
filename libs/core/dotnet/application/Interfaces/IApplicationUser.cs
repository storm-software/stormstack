using System.Collections;

namespace OpenSystem.Core.Application.Interfaces
{
   public interface IApplicationUser
  {
      /// <summary>
      /// Gets or sets the primary key for this user.
      /// </summary>
      string Id { get; set; }

      /// <summary>
      /// Gets or sets the user name for this user.
      /// </summary>
      string? UserName { get; set; }

      /// <summary>
      /// Gets or sets the email address for this user.
      /// </summary>
      string? Email { get; }

      /// <summary>
      /// Gets or sets a flag indicating if a user has confirmed their email address.
      /// </summary>
      bool EmailConfirmed { get; }

      /// <summary>
      /// Navigation property for this users login accounts.
      /// </summary>
      // ICollection? Logins { get; }

      /// <summary>
      /// Gets or sets the number of failed login attempts for the current user.
      /// </summary>
      int AccessFailedCount { get; set; }

      /// <summary>
      /// Navigation property for the roles this user belongs to.
      /// </summary>
      ICollection? Roles  { get; set;}
  }
}
