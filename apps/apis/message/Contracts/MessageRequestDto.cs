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
    /// An object sent to the server in a request to add a new or edit an existing &#x60;Message&#x60;. 
    /// </summary>
    [DataContract]
    public partial class MessageRequestDto : IEquatable<MessageRequestDto>
    {
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
            sb.Append("class MessageRequestDto {\n");
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
            return obj.GetType() == GetType() && Equals((MessageRequestDto)obj);
        }

        /// <summary>
        /// Returns true if MessageRequestDto instances are equal
        /// </summary>
        /// <param name="other">Instance of MessageRequestDto to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(MessageRequestDto other)
        {
            if (other is null) return false;
            if (ReferenceEquals(this, other)) return true;

            return 
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

        public static bool operator ==(MessageRequestDto left, MessageRequestDto right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(MessageRequestDto left, MessageRequestDto right)
        {
            return !Equals(left, right);
        }

        #pragma warning restore 1591
        #endregion Operators
    }
}
