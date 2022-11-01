/*
 * Message
 *
 * A collection of message APIs used by the Open System repository
 *
 * The version of the OpenAPI document: 1.0
 * Contact: Patrick.Sullivan@broadridge.com
 */

using System;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using OpenSystem.Apis.Message.Converters;

namespace OpenSystem.Apis.Message.Contracts
{ 
    /// <summary>
    /// 
    /// </summary>
    [DataContract]
    public partial class MessageAllOfDto : IEquatable<MessageAllOfDto>
    {
        /// <summary>
        /// Gets or Sets MessageNumber
        /// </summary>
        [Required]
        [Range(0, 999999999)]
        [DataMember(Name="messageNumber", EmitDefaultValue=true)]
        public int MessageNumber { get; set; }

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class MessageAllOfDto {\n");
            sb.Append("  MessageNumber: ").Append(MessageNumber).Append("\n");
            sb.Append("}\n");
            return sb.ToString();
        }

        /// <summary>
        /// Returns the JSON string presentation of the object
        /// </summary>
        /// <returns>JSON string presentation of the object</returns>
        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this, Newtonsoft.Json.Formatting.Indented);
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
            return obj.GetType() == GetType() && Equals((MessageAllOfDto)obj);
        }

        /// <summary>
        /// Returns true if MessageAllOfDto instances are equal
        /// </summary>
        /// <param name="other">Instance of MessageAllOfDto to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(MessageAllOfDto other)
        {
            if (other is null) return false;
            if (ReferenceEquals(this, other)) return true;

            return 
                (
                    MessageNumber == other.MessageNumber ||
                    
                    MessageNumber.Equals(other.MessageNumber)
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
                    
                    hashCode = hashCode * 59 + MessageNumber.GetHashCode();
                return hashCode;
            }
        }

        #region Operators
        #pragma warning disable 1591

        public static bool operator ==(MessageAllOfDto left, MessageAllOfDto right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(MessageAllOfDto left, MessageAllOfDto right)
        {
            return !Equals(left, right);
        }

        #pragma warning restore 1591
        #endregion Operators
    }
}
