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
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Versioning;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Swashbuckle.AspNetCore.Annotations;
using Swashbuckle.AspNetCore.SwaggerGen;
using OpenSystem.Apis.Reaction.Attributes;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Application.Models.DTOs;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using OpenSystem.Core.WebApi.Controllers;

namespace OpenSystem.Apis.Reaction.Controllers.v1
{

    /// <summary>
    /// Controller for ReactionApi service implementation(s)
    /// </summary>
    [Description("Controller for ReactionApi service implementation(s)")]
    [Authorize]
    [ApiVersion("1")]
    [Route("api/v{version:apiVersion}")]
    public sealed class ReactionApiController : BaseApiController
    {
        /// <summary>
        /// Constructor method for ReactionApiController
        /// </summary>
        /// <remarks>Constructor method to generate an instance of a ReactionApiController</remarks>
        public ReactionApiController(ILogger<ReactionApiController> _logger,
            IHttpContextAccessor _context)
            : base(_logger,
            _context)
        {
        }

        /// <summary>
        /// An end point to return the current API status
        /// </summary>
        /// <remarks>Add new message record</remarks>
        /// <response code="200">Example response</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpGet]
        [Route("status")]
        public async Task<IActionResult> Status()
        {
          var msg = $"Running on {Context.Request.Host}";

          Logger.LogInformation(msg);
          return Ok(msg);
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
        [MapToApiVersion("1")]
        [HttpPost]
        [Route("reactions/{contentId}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [AllowAnonymous]
        [SwaggerOperation("AddReaction")]
        [SwaggerResponse(statusCode: 200, type: typeof(CommandSuccessResponse), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsResponse), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsResponse), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsResponse), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsResponse), description: "Service Unavailable")]
        public  async Task<IActionResult> AddReaction([FromRoute (Name = "contentId")][Required]string contentId,
          [FromBody]AddReactionRequest? requestBody,
          CancellationToken cancellationToken)
        {

            // Create an instance of the request object
            var request = new AddReactionCommand();

            if (requestBody != null)
              requestBody.Copy(request);

            request.ContentId = contentId;

            return Ok(await SendRequest(request,
              cancellationToken));
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
        [MapToApiVersion("1")]
        [HttpGet]
        [Route("reactions/{contentId}")]
        [Consumes("application/json")]
        [ValidateModelState]
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

            return Ok(await SendRequest(request,
              cancellationToken));
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
        [ValidateModelState]
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

            return Ok(await SendRequest(request,
              cancellationToken));
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
        [ValidateModelState]
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

            return Ok(await SendRequest(request,
              cancellationToken));
        }
    }
}
