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
    /// A model containing the reaction data returned from the server
    /// </summary>
    [DataContract]
    public class ReactionDetailRecord : IEquatable<ReactionDetailRecord>
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
            sb.Append("class ReactionDetailRecord {\n");
            sb.Append("  Id: ").Append(Id).Append("\n");
            sb.Append("  CreatedOn: ").Append(CreatedOn).Append("\n");
            sb.Append("  CreatedBy: ").Append(CreatedBy).Append("\n");
            sb.Append("  UpdatedOn: ").Append(UpdatedOn).Append("\n");
            sb.Append("  UpdatedBy: ").Append(UpdatedBy).Append("\n");
            sb.Append("  UserId: ").Append(UserId).Append("\n");
            sb.Append("  Type: ").Append(Type).Append("\n");
            sb.Append("}\n");
            return sb.ToString();
        }

        /// <summary>
        /// Copies the current values to another instance of the object
        /// </summary>
        /// <returns>An instance of the object with the current values copied to it</returns>
        public ReactionDetailRecord Copy(ReactionDetailRecord? copyTo)
        {
            if (copyTo == null)
              copyTo = new ReactionDetailRecord();

            copyTo.Id = this.Id;
            copyTo.CreatedOn = this.CreatedOn;
            copyTo.CreatedBy = this.CreatedBy;
            copyTo.UpdatedOn = this.UpdatedOn;
            copyTo.UpdatedBy = this.UpdatedBy;
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
            return obj.GetType() == GetType() && Equals((ReactionDetailRecord)obj);
        }

        /// <summary>
        /// Returns true if ReactionDetailRecord instances are equal
        /// </summary>
        /// <param name="other">Instance of ReactionDetailRecord to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(ReactionDetailRecord other)
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
                ) &&
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
                    if (UserId != null)
                    hashCode = hashCode * 59 + UserId.GetHashCode();
                    if (Type != null)
                    hashCode = hashCode * 59 + Type.GetHashCode();
                return hashCode;
            }
        }

        #region Operators
        #pragma warning disable 1591

        public static bool operator ==(ReactionDetailRecord left, ReactionDetailRecord right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(ReactionDetailRecord left, ReactionDetailRecord right)
        {
            return !Equals(left, right);
        }

        #pragma warning restore 1591
        #endregion Operators
    }
}
