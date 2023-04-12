/*
 * Reaction APIs
 *
 * A collection of APIs used to get and set user reactions and comments for an article/page
 *
 * The version of the OpenAPI document: 1
 * Contact: Patrick.Joseph.Sullivan@protonmail.com
 */

using System;
using System.Collections.Generic;
using System.ComponentModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Akka.Hosting;
using Akka.Actor;
using OpenSystem.Reaction.Infrastructure.Actors;
using System.Threading.Tasks;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Application.Models.DTOs;
using System.Threading;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Apis.Reaction.Controllers.v1
{
    /// <summary>
    /// Controller for ReactionApi service implementation(s)
    /// </summary>
    [Description("Controller for ReactionApi service implementation(s)")]
    [ApiController]
    [Route("api/v1")]
    public sealed class ReactionApiController : ControllerBase
    {
        private readonly ILogger<ReactionApiController> _logger;
        private readonly IActorRef _counterActor;

        /// <summary>
        /// Constructor method for ReactionApiController
        /// </summary>
        /// <remarks>Constructor method to generate an instance of a ReactionApiController</remarks>
        public ReactionApiController(
            ILogger<ReactionApiController> logger,
            IRequiredActor<ReactionCommandHandler> counterActor
        )
        {
            _logger = logger;
            _counterActor = counterActor.ActorRef;
        }

        /// <summary>
        /// Add Reaction
        /// </summary>
        /// <remarks>Add a new reaction to an article</remarks>
        /// <param name="contentId">The id of the article/comment</param>
        /// <param name="addReactionRequest"></param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [HttpPost]
        [Route("reactions/{contentId?}")]
        [Consumes("application/json")]
        public async Task<IActionResult> AddReaction(
            [FromRoute(Name = "contentId")] string contentId,
            [FromBody] AddReactionRequest? requestBody,
            CancellationToken cancellationToken
        )
        {
            try
            {
                _logger.LogInformation("**** AddReaction called");
                // Create an instance of the request object
                var request = new AddReactionCommand(contentId);

                if (requestBody != null)
                {
                    request.Payload = requestBody;
                }

                var actor = _counterActor;
                if (actor == null)
                {
                    _logger.LogError("**** AddReaction actor is null");
                    return StatusCode(StatusCodes.Status503ServiceUnavailable);
                }
                _logger.LogInformation("*** AddReaction Sending Request");
                //request.ContentId = contentId;
                var result = await actor.Ask<IAggregateEventResult>(
                    request,
                    TimeSpan.FromSeconds(20)
                );
                _logger.LogInformation("*** AddReaction result: {0}", result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError("**** AddReaction exception: {0}", ex);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet]
        [Route("reactions/{contentId?}")]
        [Consumes("application/json")]
        public async Task<IActionResult> GetReactionsCount(
            [FromRoute(Name = "contentId")] string contentId,
            [FromQuery(Name = "type")] string? type,
            CancellationToken cancellationToken
        )
        {
            try
            {
                _logger.LogInformation("**** GetReactionsCount called");
                // Create an instance of the request object
                var request = new GetReactionsCountQuery(contentId);
                request.Type = type;

                var actor = _counterActor;
                if (actor == null)
                {
                    _logger.LogError("**** GetReactionsCount actor is null");
                    return StatusCode(StatusCodes.Status503ServiceUnavailable);
                }

                //request.ContentId = contentId;
                var result = await actor.Ask(request);
                _logger.LogInformation("*** GetReactionsCount result: {0}", result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError("**** GetReactionsCount exception: {0}", ex);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        /// <summary>
        /// Get Reactions
        /// </summary>
        /// <remarks>Return the reactions for a specific article, comment, etc. </remarks>
        /// <param name="contentId">The id of the article/comment</param>
        /// <param name="pageNumber">The current page number of the selected data</param>
        /// <param name="pageSize">The maximum amount of data to return in one request</param>
        /// <param name="orderBy">The field to order the request by</param>
        /// <param name="type">The type of reaction the user had</param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        /*[MapToApiVersion("1")]
        [HttpGet]
        [Route("reactions/{contentId}")]
        [Consumes("application/json")]
        [SwaggerOperation("GetReactions")]
        [SwaggerResponse(statusCode: 200, type: typeof(GetReactions200Response), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsResponse), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsResponse), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsResponse), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsResponse), description: "Service Unavailable")]
        public  async Task<IActionResult> GetReactions([FromRoute (Name = "contentId")][Required]string contentId,
          [FromQuery (Name = "pageNumber")][Required()]int pageNumber,
          [FromQuery (Name = "pageSize")][Required()]int pageSize,
          [FromQuery (Name = "orderBy")][Required()]string orderBy,
          [FromQuery (Name = "type")]string? type,
          CancellationToken cancellationToken)
        {

            // Create an instance of the request object
            var request = new GetReactionsQuery();


            request.ContentId = contentId;
            request.PageNumber = pageNumber;
            request.PageSize = pageSize;
            request.OrderBy = orderBy;
            request.Type = type;

            return await SendQueryAsync(request,
              cancellationToken);
        }
        /// <summary>
        /// Get Reaction Counts
        /// </summary>
        /// <remarks>Return the reaction counts for a specific article, comment, etc. </remarks>
        /// <param name="contentId">The id of the article/comment</param>
        /// <param name="type">The type of reaction the user had</param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpGet]
        [Route("reactions/{contentId}/count")]
        [Consumes("application/json")]
        [AllowAnonymous]
        [SwaggerOperation("GetReactionsCount")]
        [SwaggerResponse(statusCode: 200, type: typeof(GetReactionsCount200Response), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsResponse), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsResponse), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsResponse), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsResponse), description: "Service Unavailable")]
        public  async Task<IActionResult> GetReactionsCount([FromRoute (Name = "contentId")][Required]string contentId,
          [FromQuery (Name = "type")]string? type,
          CancellationToken cancellationToken)
        {

            // Create an instance of the request object
            var request = new GetReactionsCountQuery();


            request.ContentId = contentId;
            request.Type = type;

            return await SendQueryAsync(request,
              cancellationToken);
        }
        /// <summary>
        /// Remove Reaction
        /// </summary>
        /// <remarks>Remove an existing reaction to an article</remarks>
        /// <param name="contentId">The id of the article/comment</param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpDelete]
        [Route("reactions/{contentId}")]
        [Consumes("application/json")]
        [AllowAnonymous]
        [SwaggerOperation("RemoveReaction")]
        [SwaggerResponse(statusCode: 200, type: typeof(CommandSuccessResponse), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsResponse), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsResponse), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsResponse), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsResponse), description: "Service Unavailable")]
        public  async Task<IActionResult> RemoveReaction([FromRoute (Name = "contentId")][Required]string contentId,
          CancellationToken cancellationToken)
        {

            // Create an instance of the request object
            var request = new RemoveReactionCommand();

            request.ContentId = contentId;
            return await SendCommandAsync(request,
              cancellationToken);
        }*/
    }
}
