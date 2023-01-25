/*
 * User APIs
 *
 * A collection of APIs used to get and set user related data 
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
using OpenSystem.Apis.User.Attributes;
using OpenSystem.Apis.User.Contracts;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using OpenSystem.Core.DotNet.WebApi.Controllers;

namespace OpenSystem.Apis.User.Controllers.v1
{ 

    /// <summary>
    /// Controller for UsersApi service implementation(s)
    /// </summary>
    [Description("Controller for UsersApi service implementation(s)")]
    [ApiVersion("1")]
    public sealed class UsersApiController : BaseApiController
    {
        /// <summary>
        /// Constructor method for UsersApiController
        /// </summary>
        /// <remarks>Constructor method to generate an instance of a UsersApiController</remarks>
        public UsersApiController(ILogger<UsersApiController> _logger,
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
        /// Add User
        /// </summary>
        /// <remarks>Add a new user</remarks>
        /// <param name="userId">The unique Id used to identify the user</param>
        /// <param name="updateUserRequestDto"></param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpPost]
        [Route("/users/{userId}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("AddUser")]
        [SwaggerResponse(statusCode: 200, type: typeof(UpdateSuccessResponseDto), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsDto), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsDto), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsDto), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsDto), description: "Service Unavailable")]
        public async Task<IActionResult> AddUser([FromRoute (Name = "userId")][Required]Guid userId, [FromBody]UpdateUserRequestDto? updateUserRequestDto)
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
        /// Remove User
        /// </summary>
        /// <remarks>Remove an existing user from the system</remarks>
        /// <param name="userId">The unique Id used to identify the user</param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpDelete]
        [Route("/users/{userId}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("DeleteUser")]
        [SwaggerResponse(statusCode: 200, type: typeof(UpdateSuccessResponseDto), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsDto), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsDto), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsDto), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsDto), description: "Service Unavailable")]
        public async Task<IActionResult> DeleteUser([FromRoute (Name = "userId")][Required]Guid userId)
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
        /// Get User
        /// </summary>
        /// <remarks>An end point that returns data for a specific user</remarks>
        /// <param name="userId">The unique Id used to identify the user</param>
        /// <response code="200">Successful response to Get User end point</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpGet]
        [Route("/users/{userId}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("GetUser")]
        [SwaggerResponse(statusCode: 200, type: typeof(UserDto), description: "Successful response to Get User end point")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsDto), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsDto), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsDto), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsDto), description: "Service Unavailable")]
        public async Task<IActionResult> GetUser([FromRoute (Name = "userId")][Required]Guid userId)
        {

            //TODO: Uncomment the next line to return response 200 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(200, default(UserDto));
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
            ? JsonSerializer.Deserialize<UserDto>(exampleJson)
            : default(UserDto);

            //TODO: Change the data returned
            return await Task.FromResult<IActionResult>(new ObjectResult(example));
        }
        /// <summary>
        /// Get Users
        /// </summary>
        /// <remarks>An end point that returns the list of users in the system</remarks>
        /// <param name="userId">The unique Id used to identify the user</param>
        /// <param name="type">The type of the user</param>
        /// <response code="200">Successful response to Get Users end point</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpGet]
        [Route("/users")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("GetUsers")]
        [SwaggerResponse(statusCode: 200, type: typeof(List<UserDto>), description: "Successful response to Get Users end point")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsDto), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsDto), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsDto), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsDto), description: "Service Unavailable")]
        public async Task<IActionResult> GetUsers([FromRoute (Name = "userId")][Required]Guid userId, [FromQuery (Name = "type")]string? type)
        {

            //TODO: Uncomment the next line to return response 200 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(200, default(List<UserDto>));
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
            ? JsonSerializer.Deserialize<List<UserDto>>(exampleJson)
            : default(List<UserDto>);

            //TODO: Change the data returned
            return await Task.FromResult<IActionResult>(new ObjectResult(example));
        }
        /// <summary>
        /// Update User
        /// </summary>
        /// <remarks>Update an existing user</remarks>
        /// <param name="userId">The unique Id used to identify the user</param>
        /// <param name="updateUserRequestDto"></param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpPut]
        [Route("/users/{userId}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("UpdateUser")]
        [SwaggerResponse(statusCode: 200, type: typeof(UpdateSuccessResponseDto), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsDto), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsDto), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsDto), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsDto), description: "Service Unavailable")]
        public async Task<IActionResult> UpdateUser([FromRoute (Name = "userId")][Required]Guid userId, [FromBody]UpdateUserRequestDto? updateUserRequestDto)
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
    }
}
