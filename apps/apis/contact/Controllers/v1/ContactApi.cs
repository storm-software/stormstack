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
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Swashbuckle.AspNetCore.Annotations;
using Swashbuckle.AspNetCore.SwaggerGen;
using OpenSystem.Apis.Contact.Attributes;
using OpenSystem.Contact.Application.Models;
using OpenSystem.Contact.Application.Models.DTOs;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using OpenSystem.Core.WebApi.Controllers;

namespace OpenSystem.Apis.Contact.Controllers.v1
{

    /// <summary>
    /// Controller for ContactApi service implementation(s)
    /// </summary>
    [Description("Controller for ContactApi service implementation(s)")]
    [Authorize]
    [ApiVersion("1")]
    [Route("api/v{version:apiVersion}")]
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
        /// Create Contact
        /// </summary>
        /// <remarks>Add a new contact</remarks>
        /// <param name="createContactRequest"></param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpPost]
        [Route("contacts")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("CreateContact")]
        [SwaggerResponse(statusCode: 200, type: typeof(CommandSuccessResponse), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsResponse), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsResponse), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsResponse), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsResponse), description: "Service Unavailable")]
        public  async Task<IActionResult> CreateContact([FromBody]CreateContactRequest? requestBody,
          CancellationToken cancellationToken)
        {

            // Create an instance of the request object
            var request = new CreateContactCommand();

            if (requestBody != null)
              requestBody.Copy(request);


            return Ok(await SendRequest(request,
              cancellationToken));
        }
        /// <summary>
        /// Create Contact Detail
        /// </summary>
        /// <remarks>An end point that adds a new detail to an existing contact</remarks>
        /// <param name="id">The records guid</param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpPost]
        [Route("contacts/{id}/details")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("CreateContactDetail")]
        [SwaggerResponse(statusCode: 200, type: typeof(CommandSuccessResponse), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsResponse), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsResponse), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsResponse), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsResponse), description: "Service Unavailable")]
        public  async Task<IActionResult> CreateContactDetail([FromRoute (Name = "id")][Required]Guid id,
          CancellationToken cancellationToken)
        {

            // Create an instance of the request object
            var request = new CreateContactDetailCommand();


            request.Id = id;

            return Ok(await SendRequest(request,
              cancellationToken));
        }
        /// <summary>
        /// Get Contact By Id
        /// </summary>
        /// <remarks>An end point that returns data for a specific contact</remarks>
        /// <param name="id">The records guid</param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpGet]
        [Route("contacts/{id}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("GetContactById")]
        [SwaggerResponse(statusCode: 200, type: typeof(ContactRecord), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsResponse), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsResponse), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsResponse), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsResponse), description: "Service Unavailable")]
        public  async Task<IActionResult> GetContactById([FromRoute (Name = "id")][Required]Guid id,
          CancellationToken cancellationToken)
        {

            // Create an instance of the request object
            var request = new GetContactByIdQuery();


            request.Id = id;

            return Ok(await SendRequest(request,
              cancellationToken));
        }
        /// <summary>
        /// Get Contact Details
        /// </summary>
        /// <remarks>An end point that returns detail data for a specific contact</remarks>
        /// <param name="id">The records guid</param>
        /// <param name="pageNumber">The current page number of the selected data</param>
        /// <param name="pageSize">The maximum amount of data to return in one request</param>
        /// <param name="orderBy">The field to filter data by</param>
        /// <param name="reason">An reason type value to filter the returned contact details </param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpGet]
        [Route("contacts/{id}/details")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("GetContactDetails")]
        [SwaggerResponse(statusCode: 200, type: typeof(GetContactDetails200Response), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsResponse), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsResponse), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsResponse), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsResponse), description: "Service Unavailable")]
        public  async Task<IActionResult> GetContactDetails([FromRoute (Name = "id")][Required]Guid id,
          [FromQuery (Name = "pageNumber")][Required()]int pageNumber,
          [FromQuery (Name = "pageSize")][Required()]int pageSize,
          [FromQuery (Name = "orderBy")][Required()]string orderBy,
          [FromQuery (Name = "reason")]string? reason,
          CancellationToken cancellationToken)
        {

            // Create an instance of the request object
            var request = new GetContactDetailsQuery();


            request.Id = id;
            request.PageNumber = pageNumber;
            request.PageSize = pageSize;
            request.OrderBy = orderBy;
            request.Reason = reason;

            return Ok(await SendRequest(request,
              cancellationToken));
        }
        /// <summary>
        /// Get Contacts
        /// </summary>
        /// <remarks>An end point that returns the list of contacts</remarks>
        /// <param name="pageNumber">The current page number of the selected data</param>
        /// <param name="pageSize">The maximum amount of data to return in one request</param>
        /// <param name="orderBy">The field to order the records by</param>
        /// <param name="email">An email value to filter the returned contacts </param>
        /// <param name="firstName">A first name value to filter the returned contacts </param>
        /// <param name="lastName">A last name value to filter the returned contacts </param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpGet]
        [Route("contacts")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("GetContacts")]
        [SwaggerResponse(statusCode: 200, type: typeof(GetContacts200Response), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsResponse), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsResponse), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsResponse), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsResponse), description: "Service Unavailable")]
        public  async Task<IActionResult> GetContacts([FromQuery (Name = "pageNumber")][Required()]int pageNumber,
          [FromQuery (Name = "pageSize")][Required()]int pageSize,
          [FromQuery (Name = "orderBy")][Required()]string orderBy,
          [FromQuery (Name = "email")]string? email,
          [FromQuery (Name = "firstName")] [MaxLength(50)]string? firstName,
          [FromQuery (Name = "lastName")]string? lastName,
          CancellationToken cancellationToken)
        {

            // Create an instance of the request object
            var request = new GetContactsQuery();


            request.PageNumber = pageNumber;
            request.PageSize = pageSize;
            request.OrderBy = orderBy;
            request.Email = email;
            request.FirstName = firstName;
            request.LastName = lastName;

            return Ok(await SendRequest(request,
              cancellationToken));
        }
        /// <summary>
        /// Get Subscription By Email
        /// </summary>
        /// <remarks>An end point that returns a boolean value indicating if the specified email is on the subscription list</remarks>
        /// <param name="email">The email of the subscription</param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpGet]
        [Route("contacts/subscriptions/{email}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("GetSubscriptionByEmail")]
        [SwaggerResponse(statusCode: 200, type: typeof(bool), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsResponse), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsResponse), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsResponse), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsResponse), description: "Service Unavailable")]
        public  async Task<IActionResult> GetSubscriptionByEmail([FromRoute (Name = "email")][Required]string email,
          CancellationToken cancellationToken)
        {

            // Create an instance of the request object
            var request = new GetSubscriptionByEmailQuery();


            request.Email = email;

            return Ok(await SendRequest(request,
              cancellationToken));
        }
        /// <summary>
        /// Get Subscriptions
        /// </summary>
        /// <remarks>An end point that returns a list of emails on the subscription list</remarks>
        /// <param name="pageNumber">The current page number of the selected data</param>
        /// <param name="pageSize">The maximum amount of data to return in one request</param>
        /// <param name="orderBy">The field to order the data by</param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpGet]
        [Route("contacts/subscriptions")]
        [Consumes("application/json")]
        [ValidateModelState]
        [AllowAnonymous]
        [SwaggerOperation("GetSubscriptions")]
        [SwaggerResponse(statusCode: 200, type: typeof(GetSubscriptions200Response), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsResponse), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsResponse), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsResponse), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsResponse), description: "Service Unavailable")]
        public  async Task<IActionResult> GetSubscriptions([FromQuery (Name = "pageNumber")][Required()]int pageNumber,
          [FromQuery (Name = "pageSize")][Required()]int pageSize,
          [FromQuery (Name = "orderBy")][Required()]string orderBy,
          CancellationToken cancellationToken)
        {

            // Create an instance of the request object
            var request = new GetSubscriptionsQuery();


            request.PageNumber = pageNumber;
            request.PageSize = pageSize;
            request.OrderBy = orderBy;

            return Ok(await SendRequest(request,
              cancellationToken));
        }
        /// <summary>
        /// Subscribe
        /// </summary>
        /// <remarks>Add a new email address to the subcription list</remarks>
        /// <param name="email">The email of the subscription</param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpPost]
        [Route("contacts/subscriptions/{email}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [AllowAnonymous]
        [SwaggerOperation("Subscribe")]
        [SwaggerResponse(statusCode: 200, type: typeof(CommandSuccessResponse), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsResponse), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsResponse), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsResponse), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsResponse), description: "Service Unavailable")]
        public  async Task<IActionResult> Subscribe([FromRoute (Name = "email")][Required]string email,
          CancellationToken cancellationToken)
        {

            // Create an instance of the request object
            var request = new SubscribeCommand();


            request.Email = email;

            return Ok(await SendRequest(request,
              cancellationToken));
        }
        /// <summary>
        /// Unsubscribe
        /// </summary>
        /// <remarks>Remove an existing email address from the subcription list</remarks>
        /// <param name="email">The email of the subscription</param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpDelete]
        [Route("contacts/subscriptions/{email}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("Unsubscribe")]
        [SwaggerResponse(statusCode: 200, type: typeof(CommandSuccessResponse), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsResponse), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsResponse), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsResponse), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsResponse), description: "Service Unavailable")]
        public  async Task<IActionResult> Unsubscribe([FromRoute (Name = "email")][Required]string email,
          CancellationToken cancellationToken)
        {

            // Create an instance of the request object
            var request = new UnsubscribeCommand();


            request.Email = email;

            return Ok(await SendRequest(request,
              cancellationToken));
        }
        /// <summary>
        /// Update Contact
        /// </summary>
        /// <remarks>An end point that updates an existing contact</remarks>
        /// <param name="id">The records guid</param>
        /// <param name="contactHeaderRecord"></param>
        /// <response code="200">OK</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpPut]
        [Route("contacts/{id}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("UpdateContact")]
        [SwaggerResponse(statusCode: 200, type: typeof(CommandSuccessResponse), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetailsResponse), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetailsResponse), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetailsResponse), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetailsResponse), description: "Service Unavailable")]
        public  async Task<IActionResult> UpdateContact([FromRoute (Name = "id")][Required]Guid id,
          [FromBody]ContactHeaderRecord? requestBody,
          CancellationToken cancellationToken)
        {

            // Create an instance of the request object
            var request = new UpdateContactCommand();

            if (requestBody != null)
              requestBody.Copy(request);

            request.Id = id;

            return Ok(await SendRequest(request,
              cancellationToken));
        }
    }
}
