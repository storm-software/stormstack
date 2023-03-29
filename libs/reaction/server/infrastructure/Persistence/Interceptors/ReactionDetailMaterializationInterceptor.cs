using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using OpenSystem.Core.Application.Services;
using OpenSystem.Reaction.Domain.Entities;

namespace OpenSystem.Reaction.Infrastructure.Persistence.Interceptors
{
    /* public class ReactionDetailMaterializationInterceptor
       : IMaterializationInterceptor
     {
       private readonly ICurrentUserService _currentUserService;
   
       public ReactionDetailMaterializationInterceptor(ICurrentUserService currentUserService)
       {
           _currentUserService = currentUserService;
       }
   
       public object InitializedInstance(MaterializationInterceptionData materializationData,
         object instance)
       {
           if (instance is ReactionDetailEntity reactionDetailEntity)
               reactionDetailEntity.UserId = _currentUserService.UserId;
   
           return instance;
       }
     }*/
}
