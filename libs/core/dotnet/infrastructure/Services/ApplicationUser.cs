using System.Collections;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using OpenSystem.Core.Application.Interfaces;

namespace OpenSystem.Core.Infrastructure.Services;

public class ApplicationUser : IdentityUser, IApplicationUser
{
  [NotMapped]
  public ICollection? Roles { get; set;}
}
