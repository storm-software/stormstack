/*
 * Message
 *
 * A collection of message APIs used by the Open System repository
 *
 * The version of the OpenAPI document: 1.0
 * Contact: Patrick.Sullivan@broadridge.com
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
using Newtonsoft.Json;
using OpenSystem.Apis.Message.Attributes;
using OpenSystem.Apis.Message.Contracts;

namespace OpenSystem.Apis.Message.Controllers
{ 
    /// <summary>
    /// Controller for MessageApi service implementation(s)
    /// </summary>
    [Description("Controller for MessageApi service implementation(s)")]
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v1.0/messages")]
    public sealed class MessageApiController : ControllerBase
    {
        private readonly ILogger<MessageApiController> _logger;
        private readonly string _baseUrl;
        private readonly HttpContext _context;

        /// <summary>
        /// Constructor method for MessageApiController
        /// </summary>
        /// <remarks>Constructor method to generate an instance of a MessageApiController</remarks>
        public MessageApiController(ILogger<MessageApiController> logger,
            IHttpContextAccessor context)
        {
          if (context.HttpContext != null)
          {
            _context = context.HttpContext;
            var request = _context.Request;
            _baseUrl = $"{request.Scheme}://{request.Host}";
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
        /// Add Message
        /// </summary>
        /// <remarks>Add new message record</remarks>
        /// <param name="userId">User Id sending request</param>
        /// <param name="messageRequestDto"></param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [HttpPost]
        [Route("/")]
        [Consumes("application/json", "application/javascript")]
        [ValidateModelState]
        [SwaggerOperation("AddMessage")]
        [SwaggerResponse(statusCode: 200, type: typeof(UpdateSuccessResponseDto), description: "OK")]
        public async Task<IActionResult> AddMessage([FromHeader][Required()]string userId, [FromBody]MessageRequestDto? messageRequestDto)
        {

            //TODO: Uncomment the next line to return response 200 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(200, default(UpdateSuccessResponseDto));
            //TODO: Uncomment the next line to return response 401 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(401);
            //TODO: Uncomment the next line to return response 404 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(404);
            //TODO: Uncomment the next line to return response 500 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(500);
            //TODO: Uncomment the next line to return response 503 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(503);
            string exampleJson = null;
            exampleJson = "{\r\n  \"guid\" : \"123e4567-e89b-12d3-a456-426614174000\"\r\n}";
            
            var example = exampleJson != null
            ? JsonConvert.DeserializeObject<UpdateSuccessResponseDto>(exampleJson)
            : default(UpdateSuccessResponseDto);
            //TODO: Change the data returned
            return await Task.FromResult<IActionResult>(new ObjectResult(example));
        }
        /// <summary>
        /// Remove Message
        /// </summary>
        /// <remarks>Remove an existing message record</remarks>
        /// <param name="guid">The records guid</param>
        /// <param name="userId">User Id sending request</param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [HttpDelete]
        [Route("/{guid}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("DeleteMessage")]
        [SwaggerResponse(statusCode: 200, type: typeof(UpdateSuccessResponseDto), description: "OK")]
        public async Task<IActionResult> DeleteMessage([FromRoute (Name = "guid")][Required]Guid guid, [FromHeader][Required()]string userId)
        {

            //TODO: Uncomment the next line to return response 200 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(200, default(UpdateSuccessResponseDto));
            //TODO: Uncomment the next line to return response 401 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(401);
            //TODO: Uncomment the next line to return response 404 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(404);
            //TODO: Uncomment the next line to return response 500 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(500);
            //TODO: Uncomment the next line to return response 503 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(503);
            string exampleJson = null;
            exampleJson = "{\r\n  \"guid\" : \"123e4567-e89b-12d3-a456-426614174000\"\r\n}";
            
            var example = exampleJson != null
            ? JsonConvert.DeserializeObject<UpdateSuccessResponseDto>(exampleJson)
            : default(UpdateSuccessResponseDto);
            //TODO: Change the data returned
            return await Task.FromResult<IActionResult>(new ObjectResult(example));
        }
        /// <summary>
        /// Get Message
        /// </summary>
        /// <remarks>An end point that returns the system&#39;s message literals to a client</remarks>
        /// <param name="guid">The records guid</param>
        /// <param name="userId">User Id sending request</param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [HttpGet]
        [Route("/{guid}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("GetMessage")]
        [SwaggerResponse(statusCode: 200, type: typeof(MessageDto), description: "OK")]
        public async Task<IActionResult> GetMessage([FromRoute (Name = "guid")][Required]Guid guid, [FromHeader][Required()]string userId)
        {

            //TODO: Uncomment the next line to return response 200 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(200, default(MessageDto));
            //TODO: Uncomment the next line to return response 401 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(401);
            //TODO: Uncomment the next line to return response 404 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(404);
            //TODO: Uncomment the next line to return response 500 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(500);
            //TODO: Uncomment the next line to return response 503 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(503);
            string exampleJson = null;
            exampleJson = "null";
            
            var example = exampleJson != null
            ? JsonConvert.DeserializeObject<MessageDto>(exampleJson)
            : default(MessageDto);
            //TODO: Change the data returned
            return await Task.FromResult<IActionResult>(new ObjectResult(example));
        }
        /// <summary>
        /// Get Message List
        /// </summary>
        /// <remarks>An end point that returns the system&#39;s message literals to a client</remarks>
        /// <param name="messageType">The type of message to return</param>
        /// <param name="userId">User Id sending request</param>
        /// <param name="messageNumber">A specific message number to return</param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [HttpGet]
        [Route("/")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("GetMessageList")]
        [SwaggerResponse(statusCode: 200, type: typeof(List<MessageDto>), description: "OK")]
        public async Task<IActionResult> GetMessageList([FromQuery (Name = "messageType")][Required()]string messageType, [FromHeader][Required()]string userId, [FromQuery (Name = "messageNumber")][Range(0, 999999999)]int? messageNumber)
        {

            //TODO: Uncomment the next line to return response 200 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(200, default(List<MessageDto>));
            //TODO: Uncomment the next line to return response 401 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(401);
            //TODO: Uncomment the next line to return response 404 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(404);
            //TODO: Uncomment the next line to return response 500 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(500);
            //TODO: Uncomment the next line to return response 503 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(503);
            string exampleJson = null;
            exampleJson = "null";
            
            var example = exampleJson != null
            ? JsonConvert.DeserializeObject<List<MessageDto>>(exampleJson)
            : default(List<MessageDto>);
            //TODO: Change the data returned
            return await Task.FromResult<IActionResult>(new ObjectResult(example));
        }
        /// <summary>
        /// Update Message
        /// </summary>
        /// <remarks>Update an existing message record</remarks>
        /// <param name="guid">The records guid</param>
        /// <param name="userId">User Id sending request</param>
        /// <param name="messageRequestDto"></param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [HttpPatch]
        [Route("/{guid}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("UpdateMessage")]
        [SwaggerResponse(statusCode: 200, type: typeof(UpdateSuccessResponseDto), description: "OK")]
        public async Task<IActionResult> UpdateMessage([FromRoute (Name = "guid")][Required]Guid guid, [FromHeader][Required()]string userId, [FromBody]MessageRequestDto? messageRequestDto)
        {

            //TODO: Uncomment the next line to return response 200 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(200, default(UpdateSuccessResponseDto));
            //TODO: Uncomment the next line to return response 401 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(401);
            //TODO: Uncomment the next line to return response 404 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(404);
            //TODO: Uncomment the next line to return response 500 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(500);
            //TODO: Uncomment the next line to return response 503 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(503);
            string exampleJson = null;
            exampleJson = "{\r\n  \"guid\" : \"123e4567-e89b-12d3-a456-426614174000\"\r\n}";
            
            var example = exampleJson != null
            ? JsonConvert.DeserializeObject<UpdateSuccessResponseDto>(exampleJson)
            : default(UpdateSuccessResponseDto);
            //TODO: Change the data returned
            return await Task.FromResult<IActionResult>(new ObjectResult(example));
        }
    }
}
