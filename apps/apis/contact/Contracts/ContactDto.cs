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
using OpenSystem.Apis.Contact.Converters;

namespace OpenSystem.Apis.Contact.Contracts
{ 
    /// <summary>
    /// 
    /// </summary>
    [DataContract]
    public class ContactDto : IEquatable<ContactDto>
    {
        /// <summary>
        /// The &#x60;guid&#x60; associated with the record
        /// </summary>
        /// <value>The &#x60;guid&#x60; associated with the record</value>
        [Required]
        [DataMember(Name="guid", EmitDefaultValue=false)]
        public Guid Guid { get; set; }

        /// <summary>
        /// Gets or Sets CreatedOn
        /// </summary>
        [Required]
        [DataMember(Name="createdOn", EmitDefaultValue=false)]
        public DateTimeOffset CreatedOn { get; set; }

        /// <summary>
        /// Gets or Sets CreatedBy
        /// </summary>
        [Required]
        [DataMember(Name="createdBy", EmitDefaultValue=false)]
        public string CreatedBy { get; set; }

        /// <summary>
        /// Gets or Sets UpdatedOn
        /// </summary>
        [DataMember(Name="updatedOn", EmitDefaultValue=false)]
        public DateTimeOffset UpdatedOn { get; set; }

        /// <summary>
        /// Gets or Sets UpdatedBy
        /// </summary>
        [DataMember(Name="updatedBy", EmitDefaultValue=false)]
        public string UpdatedBy { get; set; }

        /// <summary>
        /// Gets or Sets FirstName
        /// </summary>
        [DataMember(Name="firstName", EmitDefaultValue=false)]
        public string FirstName { get; set; }

        /// <summary>
        /// Gets or Sets LastName
        /// </summary>
        [DataMember(Name="lastName", EmitDefaultValue=false)]
        public string LastName { get; set; }

        /// <summary>
        /// Gets or Sets PhoneNumber
        /// </summary>
        [DataMember(Name="phoneNumber", EmitDefaultValue=false)]
        public string PhoneNumber { get; set; }

        /// <summary>
        /// The email address of the contact
        /// </summary>
        /// <value>The email address of the contact</value>
        [Required]
        [DataMember(Name="email", EmitDefaultValue=false)]
        public string Email { get; set; }


        /// <summary>
        /// The type of contact request
        /// </summary>
        /// <value>The type of contact request</value>
        [TypeConverter(typeof(CustomEnumConverter<ReasonOptions>))]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public enum ReasonOptions
        {
            
            /// <summary>
            /// Enum Business for business
            /// </summary>
            [EnumMember(Value = "business")]
            Business = 1,
            
            /// <summary>
            /// Enum Question for question
            /// </summary>
            [EnumMember(Value = "question")]
            Question = 2,
            
            /// <summary>
            /// Enum Casual for casual
            /// </summary>
            [EnumMember(Value = "casual")]
            Casual = 3,
            
            /// <summary>
            /// Enum Other for other
            /// </summary>
            [EnumMember(Value = "other")]
            Other = 4
        }

        /// <summary>
        /// The type of contact request
        /// </summary>
        /// <value>The type of contact request</value>
        [DataMember(Name="reason", EmitDefaultValue=true)]
        public ReasonOptions Reason { get; set; } = ReasonOptions.Business;

        /// <summary>
        /// Gets or Sets Details
        /// </summary>
        [DataMember(Name="details", EmitDefaultValue=false)]
        public string Details { get; set; }

        /// <summary>
        /// Gets or Sets Url
        /// </summary>
        [DataMember(Name="url", EmitDefaultValue=false)]
        public string Url { get; set; }

        /// <summary>
        /// Gets or Sets IsSubscribed
        /// </summary>
        [Required]
        [DataMember(Name="isSubscribed", EmitDefaultValue=true)]
        public bool IsSubscribed { get; set; } = true;

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class ContactDto {\n");
            sb.Append("  Guid: ").Append(Guid).Append("\n");
            sb.Append("  CreatedOn: ").Append(CreatedOn).Append("\n");
            sb.Append("  CreatedBy: ").Append(CreatedBy).Append("\n");
            sb.Append("  UpdatedOn: ").Append(UpdatedOn).Append("\n");
            sb.Append("  UpdatedBy: ").Append(UpdatedBy).Append("\n");
            sb.Append("  FirstName: ").Append(FirstName).Append("\n");
            sb.Append("  LastName: ").Append(LastName).Append("\n");
            sb.Append("  PhoneNumber: ").Append(PhoneNumber).Append("\n");
            sb.Append("  Email: ").Append(Email).Append("\n");
            sb.Append("  Reason: ").Append(Reason).Append("\n");
            sb.Append("  Details: ").Append(Details).Append("\n");
            sb.Append("  Url: ").Append(Url).Append("\n");
            sb.Append("  IsSubscribed: ").Append(IsSubscribed).Append("\n");
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
            return obj.GetType() == GetType() && Equals((ContactDto)obj);
        }

        /// <summary>
        /// Returns true if ContactDto instances are equal
        /// </summary>
        /// <param name="other">Instance of ContactDto to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(ContactDto other)
        {
            if (other is null) return false;
            if (ReferenceEquals(this, other)) return true;

            return 
                (
                    Guid == other.Guid ||
                    Guid != null &&
                    Guid.Equals(other.Guid)
                ) && 
                (
                    CreatedOn == other.CreatedOn ||
                    CreatedOn != null &&
                    CreatedOn.Equals(other.CreatedOn)
                ) && 
                (
                    CreatedBy == other.CreatedBy ||
                    CreatedBy != null &&
                    CreatedBy.Equals(other.CreatedBy)
                ) && 
                (
                    UpdatedOn == other.UpdatedOn ||
                    UpdatedOn != null &&
                    UpdatedOn.Equals(other.UpdatedOn)
                ) && 
                (
                    UpdatedBy == other.UpdatedBy ||
                    UpdatedBy != null &&
                    UpdatedBy.Equals(other.UpdatedBy)
                ) && 
                (
                    FirstName == other.FirstName ||
                    FirstName != null &&
                    FirstName.Equals(other.FirstName)
                ) && 
                (
                    LastName == other.LastName ||
                    LastName != null &&
                    LastName.Equals(other.LastName)
                ) && 
                (
                    PhoneNumber == other.PhoneNumber ||
                    PhoneNumber != null &&
                    PhoneNumber.Equals(other.PhoneNumber)
                ) && 
                (
                    Email == other.Email ||
                    Email != null &&
                    Email.Equals(other.Email)
                ) && 
                (
                    Reason == other.Reason ||
                    
                    Reason.Equals(other.Reason)
                ) && 
                (
                    Details == other.Details ||
                    Details != null &&
                    Details.Equals(other.Details)
                ) && 
                (
                    Url == other.Url ||
                    Url != null &&
                    Url.Equals(other.Url)
                ) && 
                (
                    IsSubscribed == other.IsSubscribed ||
                    
                    IsSubscribed.Equals(other.IsSubscribed)
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
                    if (Guid != null)
                    hashCode = hashCode * 59 + Guid.GetHashCode();
                    if (CreatedOn != null)
                    hashCode = hashCode * 59 + CreatedOn.GetHashCode();
                    if (CreatedBy != null)
                    hashCode = hashCode * 59 + CreatedBy.GetHashCode();
                    if (UpdatedOn != null)
                    hashCode = hashCode * 59 + UpdatedOn.GetHashCode();
                    if (UpdatedBy != null)
                    hashCode = hashCode * 59 + UpdatedBy.GetHashCode();
                    if (FirstName != null)
                    hashCode = hashCode * 59 + FirstName.GetHashCode();
                    if (LastName != null)
                    hashCode = hashCode * 59 + LastName.GetHashCode();
                    if (PhoneNumber != null)
                    hashCode = hashCode * 59 + PhoneNumber.GetHashCode();
                    if (Email != null)
                    hashCode = hashCode * 59 + Email.GetHashCode();
                    
                    hashCode = hashCode * 59 + Reason.GetHashCode();
                    if (Details != null)
                    hashCode = hashCode * 59 + Details.GetHashCode();
                    if (Url != null)
                    hashCode = hashCode * 59 + Url.GetHashCode();
                    
                    hashCode = hashCode * 59 + IsSubscribed.GetHashCode();
                return hashCode;
            }
        }

        #region Operators
        #pragma warning disable 1591

        public static bool operator ==(ContactDto left, ContactDto right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(ContactDto left, ContactDto right)
        {
            return !Equals(left, right);
        }

        #pragma warning restore 1591
        #endregion Operators
    }
}
