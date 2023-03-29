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
using OpenSystem.Core.Application.Attributes;
using OpenSystem.Core.Application.Commands;
using OpenSystem.Reaction.Domain.Aggregates;
using OpenSystem.Reaction.Domain.ValueObjects;
using OpenSystem.Core.Application.Queries;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Reaction.Application.Models
{
    /// <summary>
    /// Add Reaction
    /// </summary>
    /// <remarks>Add a new reaction to an article</remarks>
    [AddCommand("/api/v1/reactions/{ReactionId}")]
    public class AddReactionCommand : Command<ReactionAggregate, ReactionId>
    {
        /// <summary>
        /// The id of the article/comment
        /// </summary>
        [Identifier]
        public string ReactionId { get; set; }

        [Payload]
        public AddReactionRequest Payload { get; set; }

        public AddReactionCommand(ReactionId reactionId)
            : base(reactionId) { }

        public AddReactionCommand(ReactionId reactionId, SourceId sourceId)
            : base(reactionId, sourceId) { }
    }

    /// <summary>
    /// Get Reactions
    /// </summary>
    /// <remarks>Return the reactions for a specific article, comment, etc. </remarks>
    [Query("/api/v1/reactions/{ReactionId}")]
    public class GetReactionsQuery : IQuery<Paged<ReactionDetailRecord>>
    {
        /// <summary>
        /// The id of the article/comment
        /// </summary>
        [Identifier]
        public string ReactionId { get; set; }

        /// <summary>
        /// The current page number of the selected data
        /// </summary>
        [QueryFilter]
        public int PageNumber { get; set; } = 1;

        /// <summary>
        /// The maximum amount of data to return in one request
        /// </summary>
        [QueryFilter]
        public int PageSize { get; set; } = 200;

        /// <summary>
        /// The field to order the request by
        /// </summary>
        [QueryFilter]
        public string OrderBy { get; set; } = "id";

        /// <summary>
        /// The type of reaction the user had
        /// </summary>
        [QueryFilter]
        public string? Type { get; set; }
    }

    /// <summary>
    /// Get Reaction Counts
    /// </summary>
    /// <remarks>Return the reaction counts for a specific article, comment, etc. </remarks>
    [Query("/api/v1/reactions/{ReactionId}/count")]
    public class GetReactionsCountQuery : IQuery<GetReactionsCount200Response>
    {
        /// <summary>
        /// The id of the article/comment
        /// </summary>
        [Identifier]
        public string ReactionId { get; set; }

        /// <summary>
        /// The type of reaction the user had
        /// </summary>
        [QueryFilter]
        public string? Type { get; set; }
    }

    /// <summary>
    /// Remove Reaction
    /// </summary>
    /// <remarks>Remove an existing reaction to an article</remarks>
    [DeleteCommand("/api/v1/reactions/{ReactionId}")]
    public class RemoveReactionCommand : Command<ReactionAggregate, ReactionId>
    {
        /// <summary>
        /// The id of the article/comment
        /// </summary>
        [Identifier]
        public string ReactionId { get; set; }

        public RemoveReactionCommand(ReactionId reactionId)
            : base(reactionId) { }

        public RemoveReactionCommand(ReactionId reactionId, SourceId sourceId)
            : base(reactionId, sourceId) { }
    }
}
