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
    /// A &#x60;Message&#x60; record returned from the server
    /// </summary>
    [DataContract]
    public partial class MessageDto : IEquatable<MessageDto>
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
        /// Gets or Sets Message
        /// </summary>
        [Required]
        [DataMember(Name="message", EmitDefaultValue=false)]
        public string Message { get; set; }


        /// <summary>
        /// Gets or Sets MessageType
        /// </summary>
        [TypeConverter(typeof(CustomEnumConverter<MessageTypeOptions>))]
        [JsonConverter(typeof(Newtonsoft.Json.Converters.StringEnumConverter))]
        public enum MessageTypeOptions
        {
            
            /// <summary>
            /// Enum FXL for FXL
            /// </summary>
            [EnumMember(Value = "FXL")]
            FXL = 1,
            
            /// <summary>
            /// Enum _24CORE for 24 CORE
            /// </summary>
            [EnumMember(Value = "24 CORE")]
            _24CORE = 2,
            
            /// <summary>
            /// Enum _24GENERAL for 24 GENERAL
            /// </summary>
            [EnumMember(Value = "24 GENERAL")]
            _24GENERAL = 3,
            
            /// <summary>
            /// Enum APPLICATION for APPLICATION
            /// </summary>
            [EnumMember(Value = "APPLICATION")]
            APPLICATION = 4,
            
            /// <summary>
            /// Enum CLIENT for CLIENT
            /// </summary>
            [EnumMember(Value = "CLIENT")]
            CLIENT = 5,
            
            /// <summary>
            /// Enum TRADINGVALIDATION for TRADINGVALIDATION
            /// </summary>
            [EnumMember(Value = "TRADINGVALIDATION")]
            TRADINGVALIDATION = 6,
            
            /// <summary>
            /// Enum INTERNALVALIDATION for INTERNALVALIDATION
            /// </summary>
            [EnumMember(Value = "INTERNALVALIDATION")]
            INTERNALVALIDATION = 7,
            
            /// <summary>
            /// Enum _24TRADING for 24 TRADING
            /// </summary>
            [EnumMember(Value = "24 TRADING")]
            _24TRADING = 8
        }

        /// <summary>
        /// Gets or Sets MessageType
        /// </summary>
        [Required]
        [DataMember(Name="messageType", EmitDefaultValue=true)]
        public MessageTypeOptions MessageType { get; set; } = MessageTypeOptions.FXL;

        /// <summary>
        /// Gets or Sets MessageNumber
        /// </summary>
        [Required]
        [Range(0, 999999999)]
        [DataMember(Name="messageNumber", EmitDefaultValue=true)]
        public int MessageNumber { get; set; }


        /// <summary>
        /// Gets or Sets Culture
        /// </summary>
        [TypeConverter(typeof(CustomEnumConverter<CultureOptions>))]
        [JsonConverter(typeof(Newtonsoft.Json.Converters.StringEnumConverter))]
        public enum CultureOptions
        {
            
            /// <summary>
            /// Enum ENUS for EN-US
            /// </summary>
            [EnumMember(Value = "EN-US")]
            ENUS = 1
        }

        /// <summary>
        /// Gets or Sets Culture
        /// </summary>
        [Required]
        [DataMember(Name="culture", EmitDefaultValue=true)]
        public CultureOptions Culture { get; set; } = CultureOptions.ENUS;

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class MessageDto {\n");
            sb.Append("  Guid: ").Append(Guid).Append("\n");
            sb.Append("  CreatedOn: ").Append(CreatedOn).Append("\n");
            sb.Append("  CreatedBy: ").Append(CreatedBy).Append("\n");
            sb.Append("  UpdatedOn: ").Append(UpdatedOn).Append("\n");
            sb.Append("  UpdatedBy: ").Append(UpdatedBy).Append("\n");
            sb.Append("  Message: ").Append(Message).Append("\n");
            sb.Append("  MessageType: ").Append(MessageType).Append("\n");
            sb.Append("  MessageNumber: ").Append(MessageNumber).Append("\n");
            sb.Append("  Culture: ").Append(Culture).Append("\n");
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
            return obj.GetType() == GetType() && Equals((MessageDto)obj);
        }

        /// <summary>
        /// Returns true if MessageDto instances are equal
        /// </summary>
        /// <param name="other">Instance of MessageDto to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(MessageDto other)
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
                    Message == other.Message ||
                    Message != null &&
                    Message.Equals(other.Message)
                ) && 
                (
                    MessageType == other.MessageType ||
                    
                    MessageType.Equals(other.MessageType)
                ) && 
                (
                    MessageNumber == other.MessageNumber ||
                    
                    MessageNumber.Equals(other.MessageNumber)
                ) && 
                (
                    Culture == other.Culture ||
                    
                    Culture.Equals(other.Culture)
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
                    if (Message != null)
                    hashCode = hashCode * 59 + Message.GetHashCode();
                    
                    hashCode = hashCode * 59 + MessageType.GetHashCode();
                    
                    hashCode = hashCode * 59 + MessageNumber.GetHashCode();
                    
                    hashCode = hashCode * 59 + Culture.GetHashCode();
                return hashCode;
            }
        }

        #region Operators
        #pragma warning disable 1591

        public static bool operator ==(MessageDto left, MessageDto right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(MessageDto left, MessageDto right)
        {
            return !Equals(left, right);
        }

        #pragma warning restore 1591
        #endregion Operators
    }
}
