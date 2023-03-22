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
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Infrastructure.WebApi.Filters;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Application.Models.DTOs;

namespace OpenSystem.Apis.Reaction.Routes.v1
{
  public static class RouteGroupBuilderExtensions
  {
      public static RouteGroupBuilder AddRouteGroup(this RouteGroupBuilder group)
      {
          group.AddEndpointFilterFactory(ValidationFilter.ValidationFilterFactory);
          group.MapGet("/{contentId?}",
            async Task<Results<Ok, NotFound>>
            ([FromRoute (Name = "contentId")]string? contentId,
            [FromQuery (Name = "pageNumber")][Required()]int pageNumber,
            [FromQuery (Name = "pageSize")][Required()]int pageSize,
            [FromQuery (Name = "orderBy")][Required()]string orderBy,
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

              /*return await SendQueryAsync(request,
                cancellationToken);*/

                return TypedResults.Ok(await _sender.Send(request,
                  cancellationToken));
          })
           .WithName("GetReactions");
          /*.WithOpenApi(openApi => new(openApi)
          {
                Summary = "Get Reactions",
                Description = "Return the reactions for a specific article, comment, etc."
          });*/

          group.MapPost("/{contentId}",
          async Task<Results<Ok<GetReactions200Response>, NotFound, UnprocessableEntity>>
          ([FromRoute (Name = "contentId")][Required]string contentId,
          [FromBody] AddReactionRequest? requestBody,
            ISender? _sender,
            CancellationToken cancellationToken) => {

            // private ISender? _sender => HttpContext.RequestServices.GetService<ISender>();
              // do the thing
              //return Results.Ok();

               // Create an instance of the request object
             // var request = new GetReactionsQuery();


              /*request.ContentId = contentId;
              request.PageNumber = pageNumber;
              request.PageSize = pageSize;
              request.OrderBy = orderBy;
              request.Type = type;

              return await SendQueryAsync(request,
                cancellationToken);*/

            // Create an instance of the request object
            var request = new AddReactionCommand();

            if (requestBody != null)
              requestBody.Copy(request);

            request.ContentId = contentId;

              await _sender.Send(request,
                cancellationToken);

              /*var request = new AddReactionCommand();

            if (requestBody != null)
              requestBody.Copy(request);

            request.ContentId = contentId;
            return await SendCommandAsync(request,
              cancellationToken);*/
          })
           .WithName("AddReaction");
          /*.WithOpenApi(openApi => new(openApi)
          {
                Summary = "Get Reactions",
                Description = "Return the reactions for a specific article, comment, etc."
          });*/

          return group;
      }


  }
}
