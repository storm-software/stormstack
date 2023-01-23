/*
 * Reaction APIs
 *
 * A collection of APIs used to get and set user reactions and comments for an article/page 
 *
 * The version of the OpenAPI document: 1
 * Contact: Patrick.Joseph.Sullivan@protonmail.com
 */

using System;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using OpenSystem.Apis.Reaction.Converters;

namespace OpenSystem.Apis.Reaction.Contracts
{ 
    /// <summary>
    /// 
    /// </summary>
    [DataContract]
    public class GetReactions200ResponseAllOfDto : IEquatable<GetReactions200ResponseAllOfDto>
    {
        /// <summary>
        /// The id of the article/page
        /// </summary>
        /// <value>The id of the article/page</value>
        [Required]
        [DataMember(Name="articleId", EmitDefaultValue=false)]
        public string ArticleId { get; set; }

        /// <summary>
        /// The list of reactions for the specified article 
        /// </summary>
        /// <value>The list of reactions for the specified article </value>
        [Required]
        [DataMember(Name="reactions", EmitDefaultValue=false)]
        public List<ReactionDetailDto> Reactions { get; set; }

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class GetReactions200ResponseAllOfDto {\n");
            sb.Append("  ArticleId: ").Append(ArticleId).Append("\n");
            sb.Append("  Reactions: ").Append(Reactions).Append("\n");
            sb.Append("}\n");
            return sb.ToString();
        }

        /// <summary>
        /// Returns the JSON string presentation of the object
        /// </summary>
        /// <returns>JSON string presentation of the object</returns>
        public string ToJson()
        {
            return JsonSerializer.Serialize(this,
              new JsonSerializerOptions { WriteIndented = true });
        }

        /// <summary>
        /// Returns true if objects are equal
        /// </summary>
        /// <param name="obj">Object to be compared</param>
        /// <returns>Boolean</returns>
        public override bool Equals(object obj)
        {
            if (obj is null) return false;
            if (ReferenceEquals(this, obj)) return true;
            return obj.GetType() == GetType() && Equals((GetReactions200ResponseAllOfDto)obj);
        }

        /// <summary>
        /// Returns true if GetReactions200ResponseAllOfDto instances are equal
        /// </summary>
        /// <param name="other">Instance of GetReactions200ResponseAllOfDto to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(GetReactions200ResponseAllOfDto other)
        {
            if (other is null) return false;
            if (ReferenceEquals(this, other)) return true;

            return 
                (
                    ArticleId == other.ArticleId ||
                    ArticleId != null &&
                    ArticleId.Equals(other.ArticleId)
                ) && 
                (
                    Reactions == other.Reactions ||
                    Reactions != null &&
                    other.Reactions != null &&
                    Reactions.SequenceEqual(other.Reactions)
                );
        }

        /// <summary>
        /// Gets the hash code
        /// </summary>
        /// <returns>Hash code</returns>
        public override int GetHashCode()
        {
            unchecked // Overflow is fine, just wrap
            {
                var hashCode = 41;
                // Suitable nullity checks etc, of course :)
                    if (ArticleId != null)
                    hashCode = hashCode * 59 + ArticleId.GetHashCode();
                    if (Reactions != null)
                    hashCode = hashCode * 59 + Reactions.GetHashCode();
                return hashCode;
            }
        }

        #region Operators
        #pragma warning disable 1591

        public static bool operator ==(GetReactions200ResponseAllOfDto left, GetReactions200ResponseAllOfDto right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(GetReactions200ResponseAllOfDto left, GetReactions200ResponseAllOfDto right)
        {
            return !Equals(left, right);
        }

        #pragma warning restore 1591
        #endregion Operators
    }
}
