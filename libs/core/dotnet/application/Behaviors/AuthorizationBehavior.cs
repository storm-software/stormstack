using System.Reflection;
using MediatR;
using OpenSystem.Core.DotNet.Application.Attributes;
using OpenSystem.Core.DotNet.Application.Interfaces;
using OpenSystem.Core.DotNet.Domain.Exceptions;

namespace OpenSystem.Core.DotNet.Application.Behaviors
{
    public class AuthorizationBehavior<TRequest, TResponse>
      : IPipelineBehavior<TRequest, TResponse>
      where TRequest : MediatR.IRequest<TResponse>
    {
      private readonly ICurrentUserService _currentUserService;

      private readonly IIdentityService _identityService;

      public AuthorizationBehavior(ICurrentUserService currentUserService,
        IIdentityService identityService)
      {
          _currentUserService = currentUserService;
          _identityService = identityService;
      }

      public async Task<TResponse> Handle(TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
      {
          var authorizeAttributes = request.GetType().GetCustomAttributes<AuthorizeAttribute>();

          if (authorizeAttributes.Any())
          {
              // Must be authenticated user
              if (_currentUserService.UserId == null)
              {
                  throw new UnauthorizedAccessException();
              }

              // Role-based authorization
              var authorizeAttributesWithRoles = authorizeAttributes.Where(a =>
                !string.IsNullOrWhiteSpace(a.Roles));

              if (authorizeAttributesWithRoles.Any())
              {
                  var authorized = false;
                  foreach (var roles in authorizeAttributesWithRoles.Select(a =>
                    a.Roles.Split(',')))
                  {
                      foreach (var role in roles)
                      {
                          var isInRole = await _identityService.IsInRoleAsync(_currentUserService.UserId,
                            role.Trim());
                          if (isInRole)
                          {
                              authorized = true;
                              break;
                          }
                      }
                  }

                  // Must be a member of at least one role in roles
                  if (!authorized)
                  {
                      throw new ForbiddenAccessException();
                  }
              }

              // Policy-based authorization
              var authorizeAttributesWithPolicies = authorizeAttributes.Where(a =>
                !string.IsNullOrWhiteSpace(a.Policy));
              if (authorizeAttributesWithPolicies.Any())
              {
                  foreach (var policy in authorizeAttributesWithPolicies.Select(a =>
                    a.Policy))
                  {
                      var authorized = await _identityService.AuthorizeAsync(_currentUserService.UserId, policy);

                      if (!authorized)
                      {
                          throw new ForbiddenAccessException();
                      }
                  }
              }
          }

          // User is authorized / authorization not required
          return await next();
      }
  }
}
