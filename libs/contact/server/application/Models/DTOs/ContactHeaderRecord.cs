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
    /// Contact data used to identify an individual and attach details too.
    /// </summary>
    [DataContract]
    public class ContactHeaderRecord : IEquatable<ContactHeaderRecord>
    {
        /// <summary>
        /// Gets or Sets FirstName
        /// </summary>
        [MaxLength(50)]
        [DataMember(Name = "firstName", EmitDefaultValue = true)]
        public string? FirstName { get; set; }

        /// <summary>
        /// Gets or Sets LastName
        /// </summary>
        [MaxLength(50)]
        [DataMember(Name = "lastName", EmitDefaultValue = true)]
        public string? LastName { get; set; }

        /// <summary>
        /// Gets or Sets PhoneNumber
        /// </summary>
        [RegularExpression("^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$")]
        [MaxLength(15)]
        [DataMember(Name = "phoneNumber", EmitDefaultValue = true)]
        public string? PhoneNumber { get; set; }

        /// <summary>
        /// The email address of the contact
        /// </summary>
        /// <value>The email address of the contact</value>
        [Required]
        [DataMember(Name = "email", EmitDefaultValue = false)]
        public string Email { get; set; }

        /// <summary>
        /// Gets or Sets IsSubscribed
        /// </summary>
        [Required]
        [DataMember(Name = "isSubscribed", EmitDefaultValue = false)]
        public bool IsSubscribed { get; set; } = true;

        /// <summary>
        /// Gets or Sets AddressLine1
        /// </summary>
        [MaxLength(50)]
        [DataMember(Name = "addressLine1", EmitDefaultValue = true)]
        public string? AddressLine1 { get; set; }

        /// <summary>
        /// Gets or Sets AddressLine2
        /// </summary>
        [MaxLength(50)]
        [DataMember(Name = "addressLine2", EmitDefaultValue = true)]
        public string? AddressLine2 { get; set; }

        /// <summary>
        /// Gets or Sets City
        /// </summary>
        [MaxLength(50)]
        [DataMember(Name = "city", EmitDefaultValue = true)]
        public string? City { get; set; }

        /// <summary>
        /// Gets or Sets State
        /// </summary>
        [MaxLength(50)]
        [DataMember(Name = "state", EmitDefaultValue = true)]
        public string? State { get; set; }

        /// <summary>
        /// Gets or Sets CountryCode
        /// </summary>
        [MaxLength(50)]
        [DataMember(Name = "countryCode", EmitDefaultValue = true)]
        public string? CountryCode { get; set; }

        /// <summary>
        /// Gets or Sets PostalCode
        /// </summary>
        [StringLength(9, MinimumLength=5)]
        [DataMember(Name = "postalCode", EmitDefaultValue = true)]
        public string? PostalCode { get; set; }

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class ContactHeaderRecord {\n");
            sb.Append("  FirstName: ").Append(FirstName).Append("\n");
            sb.Append("  LastName: ").Append(LastName).Append("\n");
            sb.Append("  PhoneNumber: ").Append(PhoneNumber).Append("\n");
            sb.Append("  Email: ").Append(Email).Append("\n");
            sb.Append("  IsSubscribed: ").Append(IsSubscribed).Append("\n");
            sb.Append("  AddressLine1: ").Append(AddressLine1).Append("\n");
            sb.Append("  AddressLine2: ").Append(AddressLine2).Append("\n");
            sb.Append("  City: ").Append(City).Append("\n");
            sb.Append("  State: ").Append(State).Append("\n");
            sb.Append("  CountryCode: ").Append(CountryCode).Append("\n");
            sb.Append("  PostalCode: ").Append(PostalCode).Append("\n");
            sb.Append("}\n");
            return sb.ToString();
        }

        /// <summary>
        /// Copies the current values to another instance of the object
        /// </summary>
        /// <returns>An instance of the object with the current values copied to it</returns>
        public ContactHeaderRecord Copy(ContactHeaderRecord? copyTo)
        {
            if (copyTo == null)
              copyTo = new ContactHeaderRecord();

            copyTo.FirstName = this.FirstName;
            copyTo.LastName = this.LastName;
            copyTo.PhoneNumber = this.PhoneNumber;
            copyTo.Email = this.Email;
            copyTo.IsSubscribed = this.IsSubscribed;
            copyTo.AddressLine1 = this.AddressLine1;
            copyTo.AddressLine2 = this.AddressLine2;
            copyTo.City = this.City;
            copyTo.State = this.State;
            copyTo.CountryCode = this.CountryCode;
            copyTo.PostalCode = this.PostalCode;

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
            return obj.GetType() == GetType() && Equals((ContactHeaderRecord)obj);
        }

        /// <summary>
        /// Returns true if ContactHeaderRecord instances are equal
        /// </summary>
        /// <param name="other">Instance of ContactHeaderRecord to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(ContactHeaderRecord other)
        {
            if (other is null) return false;
            if (ReferenceEquals(this, other)) return true;

            return 
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
                    IsSubscribed == other.IsSubscribed ||
                    
                    IsSubscribed.Equals(other.IsSubscribed)
                ) && 
                (
                    AddressLine1 == other.AddressLine1 ||
                    AddressLine1 != null &&
                    AddressLine1.Equals(other.AddressLine1)
                ) && 
                (
                    AddressLine2 == other.AddressLine2 ||
                    AddressLine2 != null &&
                    AddressLine2.Equals(other.AddressLine2)
                ) && 
                (
                    City == other.City ||
                    City != null &&
                    City.Equals(other.City)
                ) && 
                (
                    State == other.State ||
                    State != null &&
                    State.Equals(other.State)
                ) && 
                (
                    CountryCode == other.CountryCode ||
                    CountryCode != null &&
                    CountryCode.Equals(other.CountryCode)
                ) && 
                (
                    PostalCode == other.PostalCode ||
                    PostalCode != null &&
                    PostalCode.Equals(other.PostalCode)
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
                    if (FirstName != null)
                    hashCode = hashCode * 59 + FirstName.GetHashCode();
                    if (LastName != null)
                    hashCode = hashCode * 59 + LastName.GetHashCode();
                    if (PhoneNumber != null)
                    hashCode = hashCode * 59 + PhoneNumber.GetHashCode();
                    if (Email != null)
                    hashCode = hashCode * 59 + Email.GetHashCode();
                    
                    hashCode = hashCode * 59 + IsSubscribed.GetHashCode();
                    if (AddressLine1 != null)
                    hashCode = hashCode * 59 + AddressLine1.GetHashCode();
                    if (AddressLine2 != null)
                    hashCode = hashCode * 59 + AddressLine2.GetHashCode();
                    if (City != null)
                    hashCode = hashCode * 59 + City.GetHashCode();
                    if (State != null)
                    hashCode = hashCode * 59 + State.GetHashCode();
                    if (CountryCode != null)
                    hashCode = hashCode * 59 + CountryCode.GetHashCode();
                    if (PostalCode != null)
                    hashCode = hashCode * 59 + PostalCode.GetHashCode();
                return hashCode;
            }
        }

        #region Operators
        #pragma warning disable 1591

        public static bool operator ==(ContactHeaderRecord left, ContactHeaderRecord right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(ContactHeaderRecord left, ContactHeaderRecord right)
        {
            return !Equals(left, right);
        }

        #pragma warning restore 1591
        #endregion Operators
    }
}
