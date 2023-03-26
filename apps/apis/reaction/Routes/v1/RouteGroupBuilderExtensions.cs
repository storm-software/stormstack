using System.ComponentModel.DataAnnotations;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using OpenSystem.Core.Application.Attributes;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Infrastructure.WebApi.Filters;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Application.Models.DTOs;

namespace OpenSystem.Apis.Reaction.Routes.v1
{
    public static class RouteGroupBuilderExtensions
    {
        public static RouteGroupBuilder AddEndPointRequestHandlers(this RouteGroupBuilder group)
        {
            // group.AddEndpointFilterFactory(ValidationFilter.ValidationFilterFactory);
            /*group.MapGet("/{contentId?}",
              async Task<Results<Ok<GetReactionsCountQuery>, NotFound, BadRequest>>
             ([FromRoute (Name = "contentId")]string? contentId,
              [FromQuery (Name = "pageNumber")][Required]int pageNumber,
              [FromQuery (Name = "pageSize")][Required]int pageSize,
              [FromQuery (Name = "orderBy")][Required]string orderBy,
              [FromQuery (Name = "type")]string? type,
                ISender? _sender,
                CancellationToken cancellationToken) => {
                // do the thing
                //return Results.Ok();
  
                //Create an instance of the request object
                var request = new GetReactionsQuery();
  
                request.ContentId = contentId;
                request.PageNumber = pageNumber;
                request.PageSize = pageSize;
                request.OrderBy = orderBy;
                request.Type = type;
  
                return await SendQueryAsync(request,
                  cancellationToken);
  
                  return TypedResults.Ok(await _sender.Send<GetReactionsCountQuery>(request,
                    cancellationToken));
            })
             .WithName("GetReactions");*/
            /*.WithOpenApi(openApi => new(openApi)
            {
                  Summary = "Get Reactions",
                  Description = "Return the reactions for a specific article, comment, etc."
            });*/

            group
                .MapGet(
                    "/{contentId}/count",
                    async Task<Results<Ok<GetReactionsCount200Response>, NotFound, BadRequest>> (
                        [FromRoute(Name = "contentId")] [Required] string contentId,
                        [FromQuery(Name = "type")] string? type,
                        ISender _sender
                    ) =>
                    {
                        // do the thing
                        //return Results.Ok();

                        //Create an instance of the request object
                        var request = new GetReactionsCountQuery();

                        request.ContentId = contentId;
                        request.Type = type;

                        /*return await SendQueryAsync(request,
                          cancellationToken);*/

                        return TypedResults.Ok(
                            await _sender.Send<GetReactionsCount200Response>(request)
                        );
                    }
                )
                .WithName("GetReactions")
                .AllowAnonymous();

            group
                .MapPost(
                    "/{contentId}",
                    async Task<Results<Ok<IIndexed>, NotFound, UnprocessableEntity>> (
                        [FromRoute(Name = "contentId")] [Required] string contentId,
                        [FromBody] [Required] AddReactionRequest requestBody,
                        ISender _sender
                    ) =>
                    {
                        // Create an instance of the request object
                        var request = new AddReactionCommand();

                        if (requestBody != null)
                            requestBody.CopyTo(request);

                        request.ContentId = contentId;
                        return TypedResults.Ok(await _sender.Send<IIndexed>(request));
                    }
                )
                .WithName("AddReaction")
                .AllowAnonymous();

            /*.WithOpenApi(openApi => new(openApi)
            {
                  Summary = "Get Reactions",
                  Description = "Return the reactions for a specific article, comment, etc."
            });*/

            return group;
        }
    }
}
