/*
 * Engagement
 *
 * A collection of APIs used to get and set user reactions and comments for an article/page
 *
 * The version of the OpenAPI document: 1.0
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
using OpenSystem.Apis.Engagement.Attributes;
using OpenSystem.Apis.Engagement.Contracts;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace OpenSystem.Apis.Engagement.Controllers
{
    /// <summary>
    /// Controller for ReactionApi service implementation(s)
    /// </summary>
    [Description("Controller for ReactionApi service implementation(s)")]
    [ApiController]
    [ApiVersion("1.0")]
    [Route("/api")]
    public sealed class ReactionApiController : ControllerBase
    {
        private readonly ILogger<ReactionApiController> _logger;
        private readonly string _baseUrl;
        private readonly HttpContext _context;

        /// <summary>
        /// Constructor method for ReactionApiController
        /// </summary>
        /// <remarks>Constructor method to generate an instance of a ReactionApiController</remarks>
        public ReactionApiController(ILogger<ReactionApiController> logger,
            IHttpContextAccessor context)
        {
          if (context.HttpContext != null)
          {
            _context = context.HttpContext;
            var request = _context.Request;
            _baseUrl = $"{request.Scheme}://{request.Host}/api";
          }

          _logger = logger;
        }

        /// <summary>
        /// An end point to indicate if the current API is running
        /// </summary>
        /// <remarks>Add new message record</remarks>
        /// <response code="200">Example response</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [HttpGet]
        [Route("/health-check")]
        public async Task<IActionResult> HealthCheck()
        {
          var msg = $"{_context.Request.Host} is healthy";

          _logger.LogInformation(msg);
          return Ok(msg);
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
        [HttpGet]
        [Route("/status")]
        public async Task<IActionResult> Status()
        {
          var msg = $"Running on {_context.Request.Host}";

          _logger.LogInformation(msg);
          return Ok(msg);
        }

        /// <summary>
        /// Add Reaction
        /// </summary>
        /// <remarks>Add a new reaction to an article</remarks>
        /// <param name="id">The id of the article/page</param>
        /// <param name="type">The type of reaction the user had</param>
        /// <param name="userId">User Id sending request</param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [HttpPost]
        [Route("/articles/{id}/reactions/{type}")]
        [Authorize]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("AddReaction")]
        [SwaggerResponse(statusCode: 200, type: typeof(UpdateSuccessResponseDto), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsDto), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsDto), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsDto), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsDto), description: "Service Unavailable")]
        public async Task<IActionResult> AddReaction([FromRoute (Name = "id")][Required]string id, [FromRoute (Name = "type")][Required]string type, [FromHeader][Required()]string userId)
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
        /// <param name="id">The id of the article/page</param>
        /// <param name="type">The type of reaction the user had</param>
        /// <param name="userId">User Id sending request</param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [HttpDelete]
        [Route("/articles/{id}/reactions/{type}")]
        [Authorize]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("DeleteReaction")]
        [SwaggerResponse(statusCode: 200, type: typeof(UpdateSuccessResponseDto), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsDto), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsDto), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsDto), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsDto), description: "Service Unavailable")]
        public async Task<IActionResult> DeleteReaction([FromRoute (Name = "id")][Required]string id, [FromRoute (Name = "type")][Required]string type, [FromHeader][Required()]string userId)
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
        /// <param name="id">The id of the article/page</param>
        /// <param name="type">The type of reaction the user had</param>
        /// <param name="userId">User Id sending request</param>
        /// <response code="200">Successful response to Get Reactions end point</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [HttpGet]
        [Route("/articles/{id}/reactions/{type}")]
        [Authorize]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("GetReaction")]
        [SwaggerResponse(statusCode: 200, type: typeof(GetReaction200ResponseDto), description: "Successful response to Get Reactions end point")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsDto), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsDto), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsDto), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsDto), description: "Service Unavailable")]
        public async Task<IActionResult> GetReaction([FromRoute (Name = "id")][Required]string id, [FromRoute (Name = "type")][Required]string type, [FromHeader][Required()]string userId)
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
        /// <param name="id">The id of the article/page</param>
        /// <param name="userId">User Id sending request</param>
        /// <response code="200">Successful response to Get Reactions end point</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [HttpGet]
        [Route("/articles/{id}/reactions")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("GetReactions")]
        [SwaggerResponse(statusCode: 200, type: typeof(GetReactions200ResponseDto), description: "Successful response to Get Reactions end point")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsDto), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsDto), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsDto), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsDto), description: "Service Unavailable")]
        public async Task<IActionResult> GetReactions([FromRoute (Name = "id")][Required]string id, [FromHeader][Required()]string userId)
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
            exampleJson = "{\"Guid\": \"12345678-0110-0000-0000-000000000000\", \"CreatedOn\": \"2022-11-11T05:00:00+00:00\", \"CreatedBy\": \"PSUL\",\"UpdatedOn\": \"0001-01-01T00:00:00+00:00\",\"UpdatedBy\": \"PSUL\", \"ArticleId\": \"home\",\"Reactions\": [{\"Type\": \"LIKE\",\"Count\": 548 }] }";

            var example = exampleJson != null
            ? JsonSerializer.Deserialize<GetReactions200ResponseDto>(exampleJson)
            : default(GetReactions200ResponseDto);

            //TODO: Change the data returned
            return await Task.FromResult<IActionResult>(new ObjectResult(example));
        }
    }
}
