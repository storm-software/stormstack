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
    /// The minimum model fields shared by all data stored in the database
    /// </summary>
    [DataContract]
    public class RecordBase : IEquatable<RecordBase>
    {
        /// <summary>
        /// The &#x60;guid&#x60; associated with the record
        /// </summary>
        /// <value>The &#x60;guid&#x60; associated with the record</value>
        [Required]
        [DataMember(Name = "id", EmitDefaultValue = false)]
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or Sets CreatedOn
        /// </summary>
        [Required]
        [DataMember(Name = "createdOn", EmitDefaultValue = false)]
        public DateTimeOffset CreatedOn { get; set; }

        /// <summary>
        /// Gets or Sets CreatedBy
        /// </summary>
        [Required]
        [DataMember(Name = "createdBy", EmitDefaultValue = false)]
        public string CreatedBy { get; set; }

        /// <summary>
        /// Gets or Sets UpdatedOn
        /// </summary>
        [DataMember(Name = "updatedOn", EmitDefaultValue = true)]
        public DateTimeOffset? UpdatedOn { get; set; }

        /// <summary>
        /// Gets or Sets UpdatedBy
        /// </summary>
        [DataMember(Name = "updatedBy", EmitDefaultValue = true)]
        public string? UpdatedBy { get; set; }

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class RecordBase {\n");
            sb.Append("  Id: ").Append(Id).Append("\n");
            sb.Append("  CreatedOn: ").Append(CreatedOn).Append("\n");
            sb.Append("  CreatedBy: ").Append(CreatedBy).Append("\n");
            sb.Append("  UpdatedOn: ").Append(UpdatedOn).Append("\n");
            sb.Append("  UpdatedBy: ").Append(UpdatedBy).Append("\n");
            sb.Append("}\n");
            return sb.ToString();
        }

        /// <summary>
        /// Copies the current values to another instance of the object
        /// </summary>
        /// <returns>An instance of the object with the current values copied to it</returns>
        public RecordBase Copy(RecordBase? copyTo)
        {
            if (copyTo == null)
              copyTo = new RecordBase();

            copyTo.Id = this.Id;
            copyTo.CreatedOn = this.CreatedOn;
            copyTo.CreatedBy = this.CreatedBy;
            copyTo.UpdatedOn = this.UpdatedOn;
            copyTo.UpdatedBy = this.UpdatedBy;

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
            return obj.GetType() == GetType() && Equals((RecordBase)obj);
        }

        /// <summary>
        /// Returns true if RecordBase instances are equal
        /// </summary>
        /// <param name="other">Instance of RecordBase to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(RecordBase other)
        {
            if (other is null) return false;
            if (ReferenceEquals(this, other)) return true;

            return 
                (
                    Id == other.Id ||
                    Id != null &&
                    Id.Equals(other.Id)
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
                    if (Id != null)
                    hashCode = hashCode * 59 + Id.GetHashCode();
                    if (CreatedOn != null)
                    hashCode = hashCode * 59 + CreatedOn.GetHashCode();
                    if (CreatedBy != null)
                    hashCode = hashCode * 59 + CreatedBy.GetHashCode();
                    if (UpdatedOn != null)
                    hashCode = hashCode * 59 + UpdatedOn.GetHashCode();
                    if (UpdatedBy != null)
                    hashCode = hashCode * 59 + UpdatedBy.GetHashCode();
                return hashCode;
            }
        }

        #region Operators
        #pragma warning disable 1591

        public static bool operator ==(RecordBase left, RecordBase right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(RecordBase left, RecordBase right)
        {
            return !Equals(left, right);
        }

        #pragma warning restore 1591
        #endregion Operators
    }
}
