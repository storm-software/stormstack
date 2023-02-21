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
using OpenSystem.Core.Application.Helpers;

namespace OpenSystem.Reaction.Application.Models.DTOs
{ 
    /// <summary>
    /// 
    /// </summary>
    [DataContract]
    public class ReactionDetailRecordAllOf : IEquatable<ReactionDetailRecordAllOf>
    {
        /// <summary>
        /// Gets or Sets UserId
        /// </summary>
        [Required]
        [DataMember(Name = "userId", EmitDefaultValue = false)]
        public string UserId { get; set; }

        /// <summary>
        /// Gets or Sets Type
        /// </summary>
        [Required]
        [DataMember(Name = "type", EmitDefaultValue = false)]
        public string Type { get; set; }

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class ReactionDetailRecordAllOf {\n");
            sb.Append("  UserId: ").Append(UserId).Append("\n");
            sb.Append("  Type: ").Append(Type).Append("\n");
            sb.Append("}\n");
            return sb.ToString();
        }

        /// <summary>
        /// Copies the current values to another instance of the object
        /// </summary>
        /// <returns>An instance of the object with the current values copied to it</returns>
        public ReactionDetailRecordAllOf Copy(ReactionDetailRecordAllOf? copyTo)
        {
            if (copyTo == null)
              copyTo = new ReactionDetailRecordAllOf();

            copyTo.UserId = this.UserId;
            copyTo.Type = this.Type;

            return copyTo;
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
            return obj.GetType() == GetType() && Equals((ReactionDetailRecordAllOf)obj);
        }

        /// <summary>
        /// Returns true if ReactionDetailRecordAllOf instances are equal
        /// </summary>
        /// <param name="other">Instance of ReactionDetailRecordAllOf to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(ReactionDetailRecordAllOf other)
        {
            if (other is null) return false;
            if (ReferenceEquals(this, other)) return true;

            return 
                (
                    UserId == other.UserId ||
                    UserId != null &&
                    UserId.Equals(other.UserId)
                ) && 
                (
                    Type == other.Type ||
                    Type != null &&
                    Type.Equals(other.Type)
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
                    if (UserId != null)
                    hashCode = hashCode * 59 + UserId.GetHashCode();
                    if (Type != null)
                    hashCode = hashCode * 59 + Type.GetHashCode();
                return hashCode;
            }
        }

        #region Operators
        #pragma warning disable 1591

        public static bool operator ==(ReactionDetailRecordAllOf left, ReactionDetailRecordAllOf right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(ReactionDetailRecordAllOf left, ReactionDetailRecordAllOf right)
        {
            return !Equals(left, right);
        }

        #pragma warning restore 1591
        #endregion Operators
    }
}
