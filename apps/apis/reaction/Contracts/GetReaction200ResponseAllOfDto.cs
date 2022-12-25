/*
 * Reaction
 *
 * A collection of APIs used to get and set reactions for an article/page 
 *
 * The version of the OpenAPI document: 1.0
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
    public class GetReaction200ResponseAllOfDto : IEquatable<GetReaction200ResponseAllOfDto>
    {
        /// <summary>
        /// The id of the article/page
        /// </summary>
        /// <value>The id of the article/page</value>
        [Required]
        [DataMember(Name="articleId", EmitDefaultValue=false)]
        public string ArticleId { get; set; }


        /// <summary>
        /// Gets or Sets Type
        /// </summary>
        [TypeConverter(typeof(CustomEnumConverter<TypeOptions>))]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public enum TypeOptions
        {
            
            /// <summary>
            /// Enum LIKE for LIKE
            /// </summary>
            [EnumMember(Value = "LIKE")]
            LIKE = 1,
            
            /// <summary>
            /// Enum DISLIKE for DISLIKE
            /// </summary>
            [EnumMember(Value = "DISLIKE")]
            DISLIKE = 2
        }

        /// <summary>
        /// Gets or Sets Type
        /// </summary>
        [Required]
        [DataMember(Name="type", EmitDefaultValue=true)]
        public TypeOptions Type { get; set; } = TypeOptions.LIKE;

        /// <summary>
        /// Gets or Sets Count
        /// </summary>
        [Required]
        [DataMember(Name="count", EmitDefaultValue=true)]
        public int Count { get; set; }

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class GetReaction200ResponseAllOfDto {\n");
            sb.Append("  ArticleId: ").Append(ArticleId).Append("\n");
            sb.Append("  Type: ").Append(Type).Append("\n");
            sb.Append("  Count: ").Append(Count).Append("\n");
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
            return obj.GetType() == GetType() && Equals((GetReaction200ResponseAllOfDto)obj);
        }

        /// <summary>
        /// Returns true if GetReaction200ResponseAllOfDto instances are equal
        /// </summary>
        /// <param name="other">Instance of GetReaction200ResponseAllOfDto to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(GetReaction200ResponseAllOfDto other)
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
                    Type == other.Type ||
                    
                    Type.Equals(other.Type)
                ) && 
                (
                    Count == other.Count ||
                    
                    Count.Equals(other.Count)
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
                    
                    hashCode = hashCode * 59 + Type.GetHashCode();
                    
                    hashCode = hashCode * 59 + Count.GetHashCode();
                return hashCode;
            }
        }

        #region Operators
        #pragma warning disable 1591

        public static bool operator ==(GetReaction200ResponseAllOfDto left, GetReaction200ResponseAllOfDto right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(GetReaction200ResponseAllOfDto left, GetReaction200ResponseAllOfDto right)
        {
            return !Equals(left, right);
        }

        #pragma warning restore 1591
        #endregion Operators
    }
}
