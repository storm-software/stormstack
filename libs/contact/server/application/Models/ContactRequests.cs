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
using OpenSystem.Contact.Application.Models.DTOs;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using OpenSystem.Core.Application.Interfaces;
using MediatR;

namespace OpenSystem.Contact.Application.Models
{ 
    /// <summary>
    /// Create Contact
    /// </summary>
    /// <remarks>Add a new contact</remarks>
    public class CreateContactCommand : CreateContactRequest, IRequest<CommandSuccessResponse>
    {
    }

    /// <summary>
    /// Create Contact Detail
    /// </summary>
    /// <remarks>An end point that adds a new detail to an existing contact</remarks>
    public class CreateContactDetailCommand : IRequest<CommandSuccessResponse>
    {
        /// <summary>
        /// The records guid
        /// </summary>
        public Guid Id { get; set; }
    }

    /// <summary>
    /// Get Contact By Id
    /// </summary>
    /// <remarks>An end point that returns data for a specific contact</remarks>
    public class GetContactByIdQuery : IRequest<ContactRecord>
    {
        /// <summary>
        /// The records guid
        /// </summary>
        public Guid Id { get; set; }
    }

    /// <summary>
    /// Get Contact Details
    /// </summary>
    /// <remarks>An end point that returns detail data for a specific contact</remarks>
    public class GetContactDetailsQuery : IRequest<GetContactDetails200Response>
    {

        /// <summary>
        /// The records guid
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// The current page number of the selected data
        /// </summary>
        public int PageNumber { get; set; } = 1;

        /// <summary>
        /// The maximum amount of data to return in one request
        /// </summary>
        public int PageSize { get; set; } = 200;

        /// <summary>
        /// The field to filter data by
        /// </summary>
        public string OrderBy { get; set; } = "details";
        /// <summary>
        /// An reason type value to filter the returned contact details 
        /// </summary>
        public string? Reason { get; set; }
    }

    /// <summary>
    /// Get Contacts
    /// </summary>
    /// <remarks>An end point that returns the list of contacts</remarks>
    public class GetContactsQuery : IRequest<GetContacts200Response>
    {

        /// <summary>
        /// The current page number of the selected data
        /// </summary>
        public int PageNumber { get; set; } = 1;

        /// <summary>
        /// The maximum amount of data to return in one request
        /// </summary>
        public int PageSize { get; set; } = 200;

        /// <summary>
        /// The field to order the records by
        /// </summary>
        public string OrderBy { get; set; } = "email";

        /// <summary>
        /// An email value to filter the returned contacts 
        /// </summary>
        public string? Email { get; set; }

        /// <summary>
        /// A first name value to filter the returned contacts 
        /// </summary>
        public string? FirstName { get; set; }
        /// <summary>
        /// A last name value to filter the returned contacts 
        /// </summary>
        public string? LastName { get; set; }
    }

    /// <summary>
    /// Get Subscription By Email
    /// </summary>
    /// <remarks>An end point that returns a boolean value indicating if the specified email is on the subscription list</remarks>
    public class GetSubscriptionByEmailQuery : IRequest<bool>
    {
        /// <summary>
        /// The email of the subscription
        /// </summary>
        public string Email { get; set; }
    }

    /// <summary>
    /// Get Subscriptions
    /// </summary>
    /// <remarks>An end point that returns a list of emails on the subscription list</remarks>
    public class GetSubscriptionsQuery : IRequest<GetSubscriptions200Response>
    {

        /// <summary>
        /// The current page number of the selected data
        /// </summary>
        public int PageNumber { get; set; } = 1;

        /// <summary>
        /// The maximum amount of data to return in one request
        /// </summary>
        public int PageSize { get; set; } = 200;
        /// <summary>
        /// The field to order the data by
        /// </summary>
        public string OrderBy { get; set; } = "email";
    }

    /// <summary>
    /// Subscribe
    /// </summary>
    /// <remarks>Add a new email address to the subcription list</remarks>
    public class SubscribeCommand : IRequest<CommandSuccessResponse>
    {
        /// <summary>
        /// The email of the subscription
        /// </summary>
        public string Email { get; set; }
    }

    /// <summary>
    /// Unsubscribe
    /// </summary>
    /// <remarks>Remove an existing email address from the subcription list</remarks>
    public class UnsubscribeCommand : IRequest<CommandSuccessResponse>
    {
        /// <summary>
        /// The email of the subscription
        /// </summary>
        public string Email { get; set; }
    }

    /// <summary>
    /// Update Contact
    /// </summary>
    /// <remarks>An end point that updates an existing contact</remarks>
    public class UpdateContactCommand : ContactHeaderRecord, IRequest<CommandSuccessResponse>
    {

        /// <summary>
        /// The records guid
        /// </summary>
        public Guid Id { get; set; }
    }
}
