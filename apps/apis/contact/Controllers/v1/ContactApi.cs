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
using OpenSystem.Contact.Application.Queries;
using OpenSystem.Contact.Application.Commands;
using OpenSystem.Contact.Application.DTOs;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using OpenSystem.Core.WebApi.Controllers;

namespace OpenSystem.Apis.Contact.Controllers.v1
{

    /// <summary>
    /// Controller for ContactApi service implementation(s)
    /// </summary>
    [Description("Controller for ContactApi service implementation(s)")]
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
        /// <param name="userId">The id of the current user sending the request</param>
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
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetails), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetails), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetails), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetails), description: "Service Unavailable")]
        public  async Task<IActionResult> CreateContact([FromHeader][Required()]string userId, [FromBody]CreateContactRequest? createContactRequest, CancellationToken cancellationToken)
        {

            return Ok(await SendRequest(new CreateContactCommand {  UserId = userId  }));
        }
        /// <summary>
        /// Create Contact Detail
        /// </summary>
        /// <remarks>An end point that adds a new detail to an existing contact</remarks>
        /// <param name="id">The records guid</param>
        /// <param name="userId">User Id sending request</param>
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
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetails), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetails), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetails), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetails), description: "Service Unavailable")]
        public  async Task<IActionResult> CreateContactDetail([FromRoute (Name = "id")][Required]Guid id, [FromHeader][Required()]string userId, CancellationToken cancellationToken)
        {

            return Ok(await SendRequest(new CreateContactDetailCommand {  : id ,  : userId  }));
        }
        /// <summary>
        /// Get Contact
        /// </summary>
        /// <remarks>An end point that returns data for a specific contact</remarks>
        /// <param name="id">The records guid</param>
        /// <param name="userId">The id of the current user sending the request</param>
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
        [SwaggerOperation("GetContact")]
        [SwaggerResponse(statusCode: 200, type: typeof(Contact), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetails), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetails), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetails), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetails), description: "Service Unavailable")]
        public  async Task<IActionResult> GetContact([FromRoute (Name = "id")][Required]Guid id, [FromHeader][Required()]string userId, CancellationToken cancellationToken)
        {

            return Ok(await SendRequest(new GetContactCommand {  : id ,  : userId  }));
        }
        /// <summary>
        /// Get Contact Details
        /// </summary>
        /// <remarks>An end point that returns detail data for a specific contact</remarks>
        /// <param name="id">The records guid</param>
        /// <param name="userId">The id of the current user sending the request</param>
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
        [SwaggerResponse(statusCode: 200, type: typeof(List<ContactDetail>), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetails), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetails), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetails), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetails), description: "Service Unavailable")]
        public  async Task<IActionResult> GetContactDetails([FromRoute (Name = "id")][Required]Guid id, [FromHeader][Required()]string userId, [FromQuery (Name = "reason")]string? reason, CancellationToken cancellationToken)
        {

            return Ok(await SendRequest(new GetContactDetailsCommand {  : id ,  : userId ,  : reason  }));
        }
        /// <summary>
        /// Get Contacts
        /// </summary>
        /// <remarks>An end point that returns the list of contacts</remarks>
        /// <param name="userId">The id of the current user sending the request</param>
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
        [SwaggerResponse(statusCode: 200, type: typeof(List<Contact>), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetails), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetails), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetails), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetails), description: "Service Unavailable")]
        public  async Task<IActionResult> GetContacts([FromHeader][Required()]string userId, [FromQuery (Name = "email")]string? email, [FromQuery (Name = "firstName")] [MaxLength(50)]string? firstName, [FromQuery (Name = "lastName")]string? lastName, CancellationToken cancellationToken)
        {

            return Ok(await SendRequest(new GetContactsQuery {  : userId ,  : email ,  : firstName ,  : lastName  }));
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
        [Route("contacts/subscriptions/{email}")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("GetSubscription")]
        [SwaggerResponse(statusCode: 200, type: typeof(bool), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetails), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetails), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetails), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetails), description: "Service Unavailable")]
        public  async Task<IActionResult> GetSubscription([FromRoute (Name = "email")][Required]string email, [FromHeader][Required()]string userId, CancellationToken cancellationToken)
        {

            return Ok(await SendRequest(new GetSubscriptionCommand {  : email ,  : userId  }));
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
        [Route("contacts/subscriptions")]
        [Consumes("application/json")]
        [ValidateModelState]
        [SwaggerOperation("GetSubscriptions")]
        [SwaggerResponse(statusCode: 200, type: typeof(List<string>), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetails), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetails), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetails), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetails), description: "Service Unavailable")]
        public  async Task<IActionResult> GetSubscriptions([FromHeader][Required()]string userId, CancellationToken cancellationToken)
        {

            return Ok(await SendRequest(new GetSubscriptionsCommand {  : userId  }));
        }
        /// <summary>
        /// Subscribe
        /// </summary>
        /// <remarks>Add a new email address to the subcription list</remarks>
        /// <param name="email">The email of the subscription</param>
        /// <param name="userId">The id of the current user sending the request</param>
        /// <param name="createContactRequest"></param>
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
        [SwaggerOperation("Subscribe")]
        [SwaggerResponse(statusCode: 200, type: typeof(CommandSuccessResponse), description: "OK")]
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetails), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetails), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetails), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetails), description: "Service Unavailable")]
        public  async Task<IActionResult> Subscribe([FromRoute (Name = "email")][Required]string email, [FromHeader][Required()]string userId, [FromBody]CreateContactRequest? createContactRequest, CancellationToken cancellationToken)
        {

            return Ok(await SendRequest(new SubscribeCommand {  : email ,  : userId ,  : createContactRequest  }));
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
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetails), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetails), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetails), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetails), description: "Service Unavailable")]
        public  async Task<IActionResult> Unsubscribe([FromRoute (Name = "email")][Required]string email, CancellationToken cancellationToken)
        {

            return Ok(await SendRequest(new UnsubscribeCommand {  : email  }));
        }
        /// <summary>
        /// Update Contact
        /// </summary>
        /// <remarks>An end point that updates an existing contact</remarks>
        /// <param name="id">The records guid</param>
        /// <param name="userId">User Id sending request</param>
        /// <param name="contactHeader"></param>
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
        [SwaggerResponse(statusCode: 401, type: typeof(ProblemDetails), description: "Unauthorized")]
        [SwaggerResponse(statusCode: 404, type: typeof(ProblemDetails), description: "Not Found")]
        [SwaggerResponse(statusCode: 500, type: typeof(ProblemDetails), description: "Internal Server Error")]
        [SwaggerResponse(statusCode: 503, type: typeof(ProblemDetails), description: "Service Unavailable")]
        public  async Task<IActionResult> UpdateContact([FromRoute (Name = "id")][Required]Guid id, [FromHeader][Required()]string userId, [FromBody]ContactHeader? contactHeader, CancellationToken cancellationToken)
        {

            return Ok(await SendRequest(new UpdateContactCommand {  : id ,  : userId ,  : contactHeader  }));
        }
    }
}
