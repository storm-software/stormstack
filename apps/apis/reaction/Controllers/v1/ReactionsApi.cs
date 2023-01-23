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
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Swashbuckle.AspNetCore.Annotations;
using Swashbuckle.AspNetCore.SwaggerGen;
using OpenSystem.Apis.Reaction.Attributes;
using OpenSystem.Apis.Reaction.Contracts;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using OpenSystem.Core.DotNet.WebApi.Controllers;

namespace OpenSystem.Apis.Reaction.Controllers.v1
{

    /// <summary>
    /// Controller for ReactionsApi service implementation(s)
    /// </summary>
    [Description("Controller for ReactionsApi service implementation(s)")]
    [ApiVersion("1")]
    public sealed class ReactionsApiController : BaseApiController
    {
        /// <summary>
        /// Constructor method for ReactionsApiController
        /// </summary>
        /// <remarks>Constructor method to generate an instance of a ReactionsApiController</remarks>
        public ReactionsApiController(ILogger<ReactionsApiController> _logger,
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
        [Route("/status")]
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
        /// <param name="contentType">The type of content the user is engaging with</param>
        /// <param name="contentId">The id of the content (ex: articleId, commentId, etc.)</param>
        /// <param name="userId">The id of the current user sending the request</param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpPost]
        [Route("/{contentType}/{contentId}/reaction/{reactionType}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("AddReaction")]
        [SwaggerResponse(statusCode: 200, type: typeof(UpdateSuccessResponseDto), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsDto), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsDto), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsDto), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsDto), description: "Service Unavailable")]
        public async Task<IActionResult> AddReaction([FromRoute (Name = "contentType")][Required]string contentType, [FromRoute (Name = "contentId")][Required]Guid contentId, [FromHeader][Required()]string userId)
        {

            //TODO: Uncomment the next line to return response 200 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(200, default(UpdateSuccessResponseDto));
            //TODO: Uncomment the next line to return response 401 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(401, default(ProblemDetailsDto));
            //TODO: Uncomment the next line to return response 404 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(404, default(ProblemDetailsDto));
            //TODO: Uncomment the next line to return response 500 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(500, default(ProblemDetailsDto));
            //TODO: Uncomment the next line to return response 503 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(503, default(ProblemDetailsDto));
            string exampleJson = null;
            exampleJson = "{\r\n  \"guid\" : \"123e4567-e89b-12d3-a456-426614174000\"\r\n}";

            var example = exampleJson != null
            ? JsonSerializer.Deserialize<UpdateSuccessResponseDto>(exampleJson)
            : default(UpdateSuccessResponseDto);

            //TODO: Change the data returned
            return await Task.FromResult<IActionResult>(new ObjectResult(example));
        }
        /// <summary>
        /// Remove Reaction
        /// </summary>
        /// <remarks>Remove an existing reaction to an article</remarks>
        /// <param name="contentType">The type of content the user is engaging with</param>
        /// <param name="contentId">The id of the content (ex: articleId, commentId, etc.)</param>
        /// <param name="userId">The id of the current user sending the request</param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpDelete]
        [Route("/{contentType}/{contentId}/reaction/{reactionType}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("DeleteReaction")]
        [SwaggerResponse(statusCode: 200, type: typeof(UpdateSuccessResponseDto), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsDto), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsDto), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsDto), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsDto), description: "Service Unavailable")]
        public async Task<IActionResult> DeleteReaction([FromRoute (Name = "contentType")][Required]string contentType, [FromRoute (Name = "contentId")][Required]Guid contentId, [FromHeader][Required()]string userId)
        {

            //TODO: Uncomment the next line to return response 200 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(200, default(UpdateSuccessResponseDto));
            //TODO: Uncomment the next line to return response 401 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(401, default(ProblemDetailsDto));
            //TODO: Uncomment the next line to return response 404 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(404, default(ProblemDetailsDto));
            //TODO: Uncomment the next line to return response 500 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(500, default(ProblemDetailsDto));
            //TODO: Uncomment the next line to return response 503 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(503, default(ProblemDetailsDto));
            string exampleJson = null;
            exampleJson = "{\r\n  \"guid\" : \"123e4567-e89b-12d3-a456-426614174000\"\r\n}";

            var example = exampleJson != null
            ? JsonSerializer.Deserialize<UpdateSuccessResponseDto>(exampleJson)
            : default(UpdateSuccessResponseDto);

            //TODO: Change the data returned
            return await Task.FromResult<IActionResult>(new ObjectResult(example));
        }
        /// <summary>
        /// Get Reaction
        /// </summary>
        /// <remarks>An end point that returns the reactions for an article/page to a client</remarks>
        /// <param name="contentType">The type of content the user is engaging with</param>
        /// <param name="contentId">The id of the content (ex: articleId, commentId, etc.)</param>
        /// <param name="userId">The id of the current user sending the request</param>
        /// <response code="200">Successful response to Get Reactions end point</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpGet]
        [Route("/{contentType}/{contentId}/reaction/{reactionType}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("GetReaction")]
        [SwaggerResponse(statusCode: 200, type: typeof(GetReaction200ResponseDto), description: "Successful response to Get Reactions end point")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsDto), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsDto), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsDto), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsDto), description: "Service Unavailable")]
        public async Task<IActionResult> GetReaction([FromRoute (Name = "contentType")][Required]string contentType, [FromRoute (Name = "contentId")][Required]Guid contentId, [FromHeader][Required()]string userId)
        {

            //TODO: Uncomment the next line to return response 200 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(200, default(GetReaction200ResponseDto));
            //TODO: Uncomment the next line to return response 401 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(401, default(ProblemDetailsDto));
            //TODO: Uncomment the next line to return response 404 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(404, default(ProblemDetailsDto));
            //TODO: Uncomment the next line to return response 500 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(500, default(ProblemDetailsDto));
            //TODO: Uncomment the next line to return response 503 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(503, default(ProblemDetailsDto));
            string exampleJson = null;
            exampleJson = "null";

            var example = exampleJson != null
            ? JsonSerializer.Deserialize<GetReaction200ResponseDto>(exampleJson)
            : default(GetReaction200ResponseDto);

            //TODO: Change the data returned
            return await Task.FromResult<IActionResult>(new ObjectResult(example));
        }
        /// <summary>
        /// Get Reactions
        /// </summary>
        /// <remarks>An end point that returns the reactions for an article/page to a client</remarks>
        /// <param name="contentType">The type of content the user is engaging with</param>
        /// <param name="contentId">The id of the content (ex: articleId, commentId, etc.)</param>
        /// <param name="userId">The id of the current user sending the request</param>
        /// <response code="200">Successful response to Get Reactions end point</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpGet]
        [Route("/{contentType}/{contentId}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("GetReactions")]
        [SwaggerResponse(statusCode: 200, type: typeof(GetReactions200ResponseDto), description: "Successful response to Get Reactions end point")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsDto), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsDto), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsDto), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsDto), description: "Service Unavailable")]
        public async Task<IActionResult> GetReactions([FromRoute (Name = "contentType")][Required]string contentType, [FromRoute (Name = "contentId")][Required]Guid contentId, [FromHeader][Required()]string userId)
        {

            //TODO: Uncomment the next line to return response 200 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(200, default(GetReactions200ResponseDto));
            //TODO: Uncomment the next line to return response 401 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(401, default(ProblemDetailsDto));
            //TODO: Uncomment the next line to return response 404 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(404, default(ProblemDetailsDto));
            //TODO: Uncomment the next line to return response 500 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(500, default(ProblemDetailsDto));
            //TODO: Uncomment the next line to return response 503 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(503, default(ProblemDetailsDto));
            string exampleJson = null;
            exampleJson = "null";

            var example = exampleJson != null
            ? JsonSerializer.Deserialize<GetReactions200ResponseDto>(exampleJson)
            : default(GetReactions200ResponseDto);

            //TODO: Change the data returned
            return await Task.FromResult<IActionResult>(new ObjectResult(example));
        }
    }
}
