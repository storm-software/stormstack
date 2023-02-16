/*
 * Contact APIs
 *
 * A collection of APIs used to get and set contact related data 
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

namespace OpenSystem.Contact.Application.Models.DTOs
{ 
    /// <summary>
    /// 
    /// </summary>
    [DataContract]
    public class GetContacts200ResponseAllOf : IEquatable<GetContacts200ResponseAllOf>
    {
        /// <summary>
        /// Gets or Sets Data
        /// </summary>
        [Required]
        [DataMember(Name = "data", EmitDefaultValue = false)]
        public List<ContactRecord> Data { get; set; }

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class GetContacts200ResponseAllOf {\n");
            sb.Append("  Data: ").Append(Data).Append("\n");
            sb.Append("}\n");
            return sb.ToString();
        }

        /// <summary>
        /// Copies the current values to another instance of the object
        /// </summary>
        /// <returns>An instance of the object with the current values copied to it</returns>
        public GetContacts200ResponseAllOf Copy(GetContacts200ResponseAllOf? copyTo)
        {
            if (copyTo == null)
              copyTo = new GetContacts200ResponseAllOf();

            copyTo.Data = this.Data;

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
            return obj.GetType() == GetType() && Equals((GetContacts200ResponseAllOf)obj);
        }

        /// <summary>
        /// Returns true if GetContacts200ResponseAllOf instances are equal
        /// </summary>
        /// <param name="other">Instance of GetContacts200ResponseAllOf to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(GetContacts200ResponseAllOf other)
        {
            if (other is null) return false;
            if (ReferenceEquals(this, other)) return true;

            return 
                (
                    Data == other.Data ||
                    Data != null &&
                    other.Data != null &&
                    Data.SequenceEqual(other.Data)
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
                    if (Data != null)
                    hashCode = hashCode * 59 + Data.GetHashCode();
                return hashCode;
            }
        }

        #region Operators
        #pragma warning disable 1591

        public static bool operator ==(GetContacts200ResponseAllOf left, GetContacts200ResponseAllOf right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(GetContacts200ResponseAllOf left, GetContacts200ResponseAllOf right)
        {
            return !Equals(left, right);
        }

        #pragma warning restore 1591
        #endregion Operators
    }
}
