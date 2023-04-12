using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Application.Commands;
using OpenSystem.Core.Application.Queries;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Api.Utilities;
using static Microsoft.AspNetCore.Http.StatusCodes;
using Akka.Actor;
using OpenSystem.Core.Api;
using Akka.Hosting;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Akka.Api
{
    public sealed class AkkaApiMediator<TActor> : ApiMediator
        where TActor : ActorBase
    {
        private readonly IRequiredActor<TActor> _actor;

        public AkkaApiMediator(
            IRequiredActor<TActor> actor,
            Type type,
            IEnumerable<RouteHandlerFilterAttribute> filters
        )
            : base(type, filters)
        {
            _actor = actor;
        }

        protected override async ValueTask<IResult> HandleCommandAsync(
            ICommand command,
            HttpContext httpContext
        )
        {
            if (_actor.ActorRef == null)
                return HttpUtility.CreateProblem(
                    httpContext,
                    Result.Failure(
                        typeof(ResultCodeApplication),
                        ResultCodeApplication.MissingMediator
                    )
                );

            var result = await _actor.ActorRef.Ask<Result>(command, TimeSpan.FromSeconds(10));

            GetLogger(httpContext).LogDebug("Response received from command bus: {Result}", result);
            if (result?.Succeeded != true)
                return HttpUtility.CreateProblem(httpContext, result);

            return HttpUtility.CreateOk(httpContext, (Result<IVersionedIndex<IIdentity>>)result);
        }

        protected override async ValueTask<IResult> HandleQueryAsync(
            IQuery<object> query,
            HttpContext httpContext
        )
        {
            if (_actor.ActorRef == null)
                return HttpUtility.CreateProblem(
                    httpContext,
                    Result.Failure(
                        typeof(ResultCodeApplication),
                        ResultCodeApplication.MissingMediator
                    )
                );

            var result = await _actor.ActorRef.Ask<Result>(query, TimeSpan.FromSeconds(10));
            if (result == null)
                return HttpUtility.CreateProblem(httpContext, result as Result, Status404NotFound);
            if (result is Result resultObj && resultObj.Failed)
                return HttpUtility.CreateProblem(httpContext, resultObj);

            return HttpUtility.CreateOk(httpContext, result as Result<object>);
        }
    }
}
