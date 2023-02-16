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
    /// Base data used to capture a contact request 
    /// </summary>
    [DataContract]
    public class ContactDetail : IEquatable<ContactDetail>
    {
        /// <summary>
        /// Gets or Sets CompanyName
        /// </summary>
        [MaxLength(50)]
        [DataMember(Name="companyName", EmitDefaultValue=false)]
        public string CompanyName { get; set; }

        /// <summary>
        /// Gets or Sets Title
        /// </summary>
        [MaxLength(50)]
        [DataMember(Name="title", EmitDefaultValue=false)]
        public string Title { get; set; }


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
            /// Enum Other for other
            /// </summary>
            [EnumMember(Value = "other")]
            Other = 3,
            
            /// <summary>
            /// Enum Project for project
            /// </summary>
            [EnumMember(Value = "project")]
            Project = 4,
            
            /// <summary>
            /// Enum Interest for interest
            /// </summary>
            [EnumMember(Value = "interest")]
            Interest = 5,
            
            /// <summary>
            /// Enum Subscription for subscription
            /// </summary>
            [EnumMember(Value = "subscription")]
            Subscription = 6
        }

        /// <summary>
        /// The type of contact request
        /// </summary>
        /// <value>The type of contact request</value>
        [Required]
        [DataMember(Name="reason", EmitDefaultValue=true)]
        public ReasonOptions Reason { get; set; } = ReasonOptions.Business;

        /// <summary>
        /// Gets or Sets Details
        /// </summary>
        [MaxLength(2000)]
        [DataMember(Name="details", EmitDefaultValue=false)]
        public string Details { get; set; }

        /// <summary>
        /// Gets or Sets Url
        /// </summary>
        [DataMember(Name="url", EmitDefaultValue=false)]
        public string Url { get; set; }

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class ContactDetail {\n");
            sb.Append("  CompanyName: ").Append(CompanyName).Append("\n");
            sb.Append("  Title: ").Append(Title).Append("\n");
            sb.Append("  Reason: ").Append(Reason).Append("\n");
            sb.Append("  Details: ").Append(Details).Append("\n");
            sb.Append("  Url: ").Append(Url).Append("\n");
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
            return obj.GetType() == GetType() && Equals((ContactDetail)obj);
        }

        /// <summary>
        /// Returns true if ContactDetail instances are equal
        /// </summary>
        /// <param name="other">Instance of ContactDetail to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(ContactDetail other)
        {
            if (other is null) return false;
            if (ReferenceEquals(this, other)) return true;

            return 
                (
                    CompanyName == other.CompanyName ||
                    CompanyName != null &&
                    CompanyName.Equals(other.CompanyName)
                ) && 
                (
                    Title == other.Title ||
                    Title != null &&
                    Title.Equals(other.Title)
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
                    if (CompanyName != null)
                    hashCode = hashCode * 59 + CompanyName.GetHashCode();
                    if (Title != null)
                    hashCode = hashCode * 59 + Title.GetHashCode();
                    
                    hashCode = hashCode * 59 + Reason.GetHashCode();
                    if (Details != null)
                    hashCode = hashCode * 59 + Details.GetHashCode();
                    if (Url != null)
                    hashCode = hashCode * 59 + Url.GetHashCode();
                return hashCode;
            }
        }

        #region Operators
        #pragma warning disable 1591

        public static bool operator ==(ContactDetail left, ContactDetail right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(ContactDetail left, ContactDetail right)
        {
            return !Equals(left, right);
        }

        #pragma warning restore 1591
        #endregion Operators
    }
}
