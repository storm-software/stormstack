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
using OpenSystem.Reaction.Application.Models.DTOs;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using OpenSystem.Core.Application.Interfaces;
using MediatR;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Reaction.Application.Models
{
    /// <summary>
    /// Add Reaction
    /// </summary>
    /// <remarks>Add a new reaction to an article</remarks>
    public class AddReactionCommand
      : AddReactionRequest, IRequest<CommandResult<IIndexed>>
    {

        /// <summary>
        /// The id of the article/comment
        /// </summary>
        public string ContentId { get; set; }
    }

    /// <summary>
    /// Get Reactions
    /// </summary>
    /// <remarks>Return the reactions for a specific article, comment, etc. </remarks>
    public class GetReactionsQuery : IRequest<GetReactions200Response>
    {

        /// <summary>
        /// The id of the article/comment
        /// </summary>
        public string ContentId { get; set; }

        /// <summary>
        /// The current page number of the selected data
        /// </summary>
        public int PageNumber { get; set; } = 1;

        /// <summary>
        /// The maximum amount of data to return in one request
        /// </summary>
        public int PageSize { get; set; } = 200;

        /// <summary>
        /// The field to order the request by
        /// </summary>
        public string OrderBy { get; set; } = "id";
        /// <summary>
        /// The type of reaction the user had
        /// </summary>
        public string? Type { get; set; }
    }

    /// <summary>
    /// Get Reaction Counts
    /// </summary>
    /// <remarks>Return the reaction counts for a specific article, comment, etc. </remarks>
    public class GetReactionsCountQuery : IRequest<GetReactionsCount200Response>
    {

        /// <summary>
        /// The id of the article/comment
        /// </summary>
        public string ContentId { get; set; }
        /// <summary>
        /// The type of reaction the user had
        /// </summary>
        public string? Type { get; set; }
    }

    /// <summary>
    /// Remove Reaction
    /// </summary>
    /// <remarks>Remove an existing reaction to an article</remarks>
    public class RemoveReactionCommand : IRequest<CommandResult<IIndexed>>
    {
        /// <summary>
        /// The id of the article/comment
        /// </summary>
        public string ContentId { get; set; }
    }
}
