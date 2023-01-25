/*
 * User APIs
 *
 * A collection of APIs used to get and set user related data 
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
using OpenSystem.Apis.User.Converters;

namespace OpenSystem.Apis.User.Contracts
{ 
    /// <summary>
    /// 
    /// </summary>
    [DataContract]
    public class UserAllOfDto : IEquatable<UserAllOfDto>
    {
        /// <summary>
        /// The unique Id used to identify the user
        /// </summary>
        /// <value>The unique Id used to identify the user</value>
        [Required]
        [DataMember(Name="userId", EmitDefaultValue=false)]
        public string UserId { get; set; }

        /// <summary>
        /// The display name of the user
        /// </summary>
        /// <value>The display name of the user</value>
        [Required]
        [DataMember(Name="name", EmitDefaultValue=false)]
        public string Name { get; set; }

        /// <summary>
        /// Gets or Sets Type
        /// </summary>
        [Required]
        [DataMember(Name="type", EmitDefaultValue=false)]
        public string Type { get; set; }

        /// <summary>
        /// Gets or Sets LastVisitDateTime
        /// </summary>
        [DataMember(Name="lastVisitDateTime", EmitDefaultValue=false)]
        public DateTimeOffset LastVisitDateTime { get; set; }

        /// <summary>
        /// Gets or Sets VisitCount
        /// </summary>
        [Required]
        [DataMember(Name="visitCount", EmitDefaultValue=true)]
        public decimal VisitCount { get; set; }

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class UserAllOfDto {\n");
            sb.Append("  UserId: ").Append(UserId).Append("\n");
            sb.Append("  Name: ").Append(Name).Append("\n");
            sb.Append("  Type: ").Append(Type).Append("\n");
            sb.Append("  LastVisitDateTime: ").Append(LastVisitDateTime).Append("\n");
            sb.Append("  VisitCount: ").Append(VisitCount).Append("\n");
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
            return obj.GetType() == GetType() && Equals((UserAllOfDto)obj);
        }

        /// <summary>
        /// Returns true if UserAllOfDto instances are equal
        /// </summary>
        /// <param name="other">Instance of UserAllOfDto to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(UserAllOfDto other)
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
                    Name == other.Name ||
                    Name != null &&
                    Name.Equals(other.Name)
                ) && 
                (
                    Type == other.Type ||
                    Type != null &&
                    Type.Equals(other.Type)
                ) && 
                (
                    LastVisitDateTime == other.LastVisitDateTime ||
                    LastVisitDateTime != null &&
                    LastVisitDateTime.Equals(other.LastVisitDateTime)
                ) && 
                (
                    VisitCount == other.VisitCount ||
                    
                    VisitCount.Equals(other.VisitCount)
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
                    if (Name != null)
                    hashCode = hashCode * 59 + Name.GetHashCode();
                    if (Type != null)
                    hashCode = hashCode * 59 + Type.GetHashCode();
                    if (LastVisitDateTime != null)
                    hashCode = hashCode * 59 + LastVisitDateTime.GetHashCode();
                    
                    hashCode = hashCode * 59 + VisitCount.GetHashCode();
                return hashCode;
            }
        }

        #region Operators
        #pragma warning disable 1591

        public static bool operator ==(UserAllOfDto left, UserAllOfDto right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(UserAllOfDto left, UserAllOfDto right)
        {
            return !Equals(left, right);
        }

        #pragma warning restore 1591
        #endregion Operators
    }
}
