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
using OpenSystem.Core.Application.Utilities;

namespace OpenSystem.Reaction.Application.Models.DTOs
{
    /// <summary>
    ///
    /// </summary>
    [DataContract]
    public class AddReactionRequest : IEquatable<AddReactionRequest>
    {
        /// <summary>
        /// Gets or Sets Type
        /// </summary>
        [TypeConverter(typeof(CustomEnumConverter<TypeOptions>))]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public enum TypeOptions
        {
            /// <summary>
            /// Enum Like for like
            /// </summary>
            [EnumMember(Value = "like")]
            Like = 1,

            /// <summary>
            /// Enum Unlike for unlike
            /// </summary>
            [EnumMember(Value = "unlike")]
            Unlike = 2,

            /// <summary>
            /// Enum Cry for cry
            /// </summary>
            [EnumMember(Value = "cry")]
            Cry = 3,

            /// <summary>
            /// Enum Laugh for laugh
            /// </summary>
            [EnumMember(Value = "laugh")]
            Laugh = 4
        }

        /// <summary>
        /// Gets or Sets Type
        /// </summary>
        [Required]
        [DataMember(Name = "type", EmitDefaultValue = false)]
        public TypeOptions Type { get; set; }

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class AddReactionRequest {\n");
            sb.Append("  Type: ").Append(Type).Append("\n");
            sb.Append("}\n");
            return sb.ToString();
        }

        /// <summary>
        /// Copies the current values to another instance of the object
        /// </summary>
        /// <returns>An instance of the object with the current values copied to it</returns>
        public AddReactionRequest CopyTo(AddReactionRequest? copyTo)
        {
            if (copyTo == null)
                copyTo = new AddReactionRequest();

            copyTo.Type = this.Type;

            return copyTo;
        }

        /// <summary>
        /// Returns the JSON string presentation of the object
        /// </summary>
        /// <returns>JSON string presentation of the object</returns>
        public string ToJson()
        {
            return JsonSerializer.Serialize(
                this,
                new JsonSerializerOptions { WriteIndented = true }
            );
        }

        /// <summary>
        /// Returns true if objects are equal
        /// </summary>
        /// <param name="obj">Object to be compared</param>
        /// <returns>Boolean</returns>
        public override bool Equals(object obj)
        {
            if (obj is null)
                return false;
            if (ReferenceEquals(this, obj))
                return true;
            return obj.GetType() == GetType() && Equals((AddReactionRequest)obj);
        }

        /// <summary>
        /// Returns true if AddReactionRequest instances are equal
        /// </summary>
        /// <param name="other">Instance of AddReactionRequest to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(AddReactionRequest other)
        {
            if (other is null)
                return false;
            if (ReferenceEquals(this, other))
                return true;

            return (Type == other.Type || Type.Equals(other.Type));
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

                hashCode = hashCode * 59 + Type.GetHashCode();
                return hashCode;
            }
        }

        #region Operators
#pragma warning disable 1591

        public static bool operator ==(AddReactionRequest left, AddReactionRequest right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(AddReactionRequest left, AddReactionRequest right)
        {
            return !Equals(left, right);
        }

#pragma warning restore 1591
        #endregion Operators
    }
}
