/*
 * Contact APIs
 *
 * A collection of APIs used to get and set contact related data
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
using OpenSystem.Apis.Contact.Attributes;
using OpenSystem.Apis.Contact.Contracts;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using OpenSystem.Core.WebApi.Controllers;
using OpenSystem.Contact.Application.Queries.GetContactById;

namespace OpenSystem.Apis.Contact.Controllers.v1
{

    /// <summary>
    /// Controller for ContactApi service implementation(s)
    /// </summary>
    [Description("Controller for ContactApi service implementation(s)")]
    [ApiVersion("1")]
    [Route("api/v{version:apiVersion}/contacts")]
    public sealed class ContactApiController : BaseApiController
    {
        /// <summary>
        /// Constructor method for ContactApiController
        /// </summary>
        /// <remarks>Constructor method to generate an instance of a ContactApiController</remarks>
        public ContactApiController(ILogger<ContactApiController> _logger,
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
        /// Add Contact Request
        /// </summary>
        /// <remarks>Add a new contact request</remarks>
        /// <param name="id">The reason for the current contact request</param>
        /// <param name="userId">The id of the current user sending the request</param>
        /// <param name="contactDetailDto"></param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpPost]
        [Route("{id}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("AddContactRequest")]
        [SwaggerResponse(statusCode: 200, type: typeof(UpdateSuccessResponseDto), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsDto), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsDto), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsDto), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsDto), description: "Service Unavailable")]
        public async Task<IActionResult> AddContactRequest([FromRoute (Name = "id")][Required]Guid id, [FromHeader][Required()]string userId, [FromBody]ContactDetailDto? contactDetailDto)
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
        /// Get Contact Request
        /// </summary>
        /// <remarks>An end point that returns data for a specific user</remarks>
        /// <param name="id">The reason for the current contact request</param>
        /// <param name="userId">The id of the current user sending the request</param>
        /// <response code="200">Successful response to Get User end point</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpGet]
        [Route("{id}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("GetContactRequest")]
        [SwaggerResponse(statusCode: 200, type: typeof(ContactDto), description: "Successful response to Get User end point")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsDto), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsDto), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsDto), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsDto), description: "Service Unavailable")]
        public async Task<IActionResult> GetContactRequest([FromRoute (Name = "id")][Required]Guid id, [FromHeader][Required()]string userId)
        {
            Logger.LogInformation("In it");

            //TODO: Uncomment the next line to return response 200 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(200, default(ContactDto));
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

            return Ok(await Mediator.Send(new GetContactByIdQuery { Id = id }));

            /*var example = exampleJson != null
            ? JsonSerializer.Deserialize<ContactDto>(exampleJson)
            : default(ContactDto);

            //TODO: Change the data returned
            return await Task.FromResult<IActionResult>(new ObjectResult(example));*/
        }
        /// <summary>
        /// Get Contact Requests
        /// </summary>
        /// <remarks>An end point that returns the list of contact requests</remarks>
        /// <param name="userId">The id of the current user sending the request</param>
        /// <response code="200">Successful response to Get Users end point</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpGet]
        [Route("/")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("GetContactRequests")]
        [SwaggerResponse(statusCode: 200, type: typeof(List<ContactDto>), description: "Successful response to Get Users end point")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsDto), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsDto), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsDto), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsDto), description: "Service Unavailable")]
        public async Task<IActionResult> GetContactRequests([FromHeader][Required()]string userId)
        {

            //TODO: Uncomment the next line to return response 200 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(200, default(List<ContactDto>));
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
            ? JsonSerializer.Deserialize<List<ContactDto>>(exampleJson)
            : default(List<ContactDto>);

            //TODO: Change the data returned
            return await Task.FromResult<IActionResult>(new ObjectResult(example));
        }
        /// <summary>
        /// Get Subscription
        /// </summary>
        /// <remarks>An end point that returns a boolean value indicating if the specified email is on the subscription list</remarks>
        /// <param name="email">The email of the subscription</param>
        /// <param name="userId">The id of the current user sending the request</param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpGet]
        [Route("subscriptions/{email}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("GetSubscription")]
        [SwaggerResponse(statusCode: 200, type: typeof(bool), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsDto), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsDto), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsDto), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsDto), description: "Service Unavailable")]
        public async Task<IActionResult> GetSubscription([FromRoute (Name = "email")][Required]string email, [FromHeader][Required()]string userId)
        {

            //TODO: Uncomment the next line to return response 200 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(200, default(bool));
            //TODO: Uncomment the next line to return response 401 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(401, default(ProblemDetailsDto));
            //TODO: Uncomment the next line to return response 404 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(404, default(ProblemDetailsDto));
            //TODO: Uncomment the next line to return response 500 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(500, default(ProblemDetailsDto));
            //TODO: Uncomment the next line to return response 503 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(503, default(ProblemDetailsDto));
            string exampleJson = null;

            var example = exampleJson != null
            ? JsonSerializer.Deserialize<bool>(exampleJson)
            : default(bool);

            //TODO: Change the data returned
            return await Task.FromResult<IActionResult>(new ObjectResult(example));
        }
        /// <summary>
        /// Get Subscriptions
        /// </summary>
        /// <remarks>An end point that returns a list of emails on the subscription list</remarks>
        /// <param name="userId">The id of the current user sending the request</param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpGet]
        [Route("subscriptions")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("GetSubscriptions")]
        [SwaggerResponse(statusCode: 200, type: typeof(List<string>), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsDto), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsDto), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsDto), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsDto), description: "Service Unavailable")]
        public async Task<IActionResult> GetSubscriptions([FromHeader][Required()]string userId)
        {

            //TODO: Uncomment the next line to return response 200 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(200, default(List<string>));
            //TODO: Uncomment the next line to return response 401 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(401, default(ProblemDetailsDto));
            //TODO: Uncomment the next line to return response 404 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(404, default(ProblemDetailsDto));
            //TODO: Uncomment the next line to return response 500 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(500, default(ProblemDetailsDto));
            //TODO: Uncomment the next line to return response 503 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(503, default(ProblemDetailsDto));
            string exampleJson = null;
            exampleJson = "\"\"";

            var example = exampleJson != null
            ? JsonSerializer.Deserialize<List<string>>(exampleJson)
            : default(List<string>);

            //TODO: Change the data returned
            return await Task.FromResult<IActionResult>(new ObjectResult(example));
        }
        /// <summary>
        /// Subscribe
        /// </summary>
        /// <remarks>Add a new email address to the subcription list</remarks>
        /// <param name="email">The email of the subscription</param>
        /// <param name="userId">The id of the current user sending the request</param>
        /// <param name="contactDetailDto"></param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpPost]
        [Route("subscriptions/{email}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("Subscribe")]
        [SwaggerResponse(statusCode: 200, type: typeof(UpdateSuccessResponseDto), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsDto), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsDto), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsDto), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsDto), description: "Service Unavailable")]
        public async Task<IActionResult> Subscribe([FromRoute (Name = "email")][Required]string email, [FromHeader][Required()]string userId, [FromBody]ContactDetailDto? contactDetailDto)
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
        /// Unsubscribe
        /// </summary>
        /// <remarks>Add an existing email address from the subcription list</remarks>
        /// <param name="email">The email of the subscription</param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpDelete]
        [Route("subscriptions/{email}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("Unsubscribe")]
        [SwaggerResponse(statusCode: 200, type: typeof(UpdateSuccessResponseDto), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsDto), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsDto), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsDto), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsDto), description: "Service Unavailable")]
        public async Task<IActionResult> Unsubscribe([FromRoute (Name = "email")][Required]string email)
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
