using System.Collections;
using Microsoft.AspNetCore.Identity;
using OpenSystem.Core.DotNet.Application.Interfaces;

namespace OpenSystem.Core.DotNet.Infrastructure.Services;

public class ApplicationUser : IdentityUser, IApplicationUser
{
  public ICollection? Roles { get; set;}
}
