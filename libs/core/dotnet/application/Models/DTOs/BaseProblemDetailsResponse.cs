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
using Microsoft.AspNetCore.Mvc;

namespace OpenSystem.Core.Application.Models.DTOs
{
    /// <summary>
    /// A base model for API errors inline with the [RFC 7807](https://www.rfc-editor.org/rfc/rfc7807) specification.
    /// </summary>
    [DataContract]
    public abstract class BaseProblemDetailsResponse 
      : ValidationProblemDetails, IEquatable<BaseProblemDetailsResponse>
    {
        /// <summary>
        /// A short, human-readable summary of the problem type. It **SHOULD NOT** change from occurrence to occurrence of the pro**blem, except for purposes of localization (e.g., using proactive content negotiation; see [RFC7231, Section 3.4](https://www.rfc-editor.org/rfc/rfc7231#section-3.4)).
        /// </summary>
        /// <value>A short, human-readable summary of the problem type. It **SHOULD NOT** change from occurrence to occurrence of the pro**blem, except for purposes of localization (e.g., using proactive content negotiation; see [RFC7231, Section 3.4](https://www.rfc-editor.org/rfc/rfc7231#section-3.4)).</value>
        [DataMember(Name = "title", EmitDefaultValue = true)]
        public virtual string Title { get; set; } = "An error occurred processing your request.";

        /// <summary>
        /// A human-readable explanation specific to this occurrence of the problem.
        /// </summary>
        /// <value>A human-readable explanation specific to this occurrence of the problem.</value>
        [DataMember(Name = "detail", EmitDefaultValue = true)]
        public string? Detail { get; set; }

        /// <summary>
        /// A longer, more detailed explanation of the problem that occurred.
        /// </summary>
        /// <value>A longer, more detailed explanation of the problem that occurred.</value>
        [DataMember(Name = "extendedDetail", EmitDefaultValue = true)]
        public string? ExtendedDetail { get; set; }

        /// <summary>
        /// An integer result code representing the failure (used to look up the display message).
        /// </summary>
        /// <value>An integer result code representing the failure (used to look up the display message).</value>
        [DataMember(Name = "resultCode", EmitDefaultValue = true)]
        public int? ResultCode { get; set; }

        /// <summary>
        /// The type of the result code (used to look up the display message).
        /// </summary>
        /// <value>The type of the result code (used to look up the display message).</value>
        [DataMember(Name = "resultType", EmitDefaultValue = true)]
        public string? ResultType { get; set; }

        /// <summary>
  	    /// Specifies the severity of a result
	      /// </summary>
        [TypeConverter(typeof(CustomEnumConverter<SeverityTypesOptions>))]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public enum SeverityTypesOptions
        {
            /// <summary>
            /// Enum Fatal for fatal
            /// </summary>
            [EnumMember(Value = "fatal")]
            Fatal = 0,

            /// <summary>
            /// Enum Error for error
            /// </summary>
            [EnumMember(Value = "error")]
            Error = 1,

            /// <summary>
            /// Enum Warning for warning
            /// </summary>
            [EnumMember(Value = "warning")]
            Warning = 2,

            /// <summary>
            /// Enum Info for info
            /// </summary>
            [EnumMember(Value = "info")]
            Info = 3,

            /// <summary>
            /// Enum Debug for debug
            /// </summary>
            [EnumMember(Value = "debug")]
            Debug = 4,

            /// <summary>
            /// Enum None for none
            /// </summary>
            [EnumMember(Value = "none")]
            None = 5
        }

        /// <summary>
        /// Gets or Sets Severity
        /// </summary>
        [Required]
        [DataMember(Name = "severity", EmitDefaultValue = false)]
        public SeverityTypesOptions Severity { get; set; } = SeverityTypesOptions.Error;

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class BaseProblemDetailsResponse {\n");
            sb.Append("  Title: ").Append(Title).Append("\n");
            sb.Append("  Detail: ").Append(Detail).Append("\n");
            sb.Append("  ExtendedDetail: ").Append(ExtendedDetail).Append("\n");
            sb.Append("  ResultCode: ").Append(ResultCode).Append("\n");
            sb.Append("  ResultType: ").Append(ResultType).Append("\n");
            sb.Append("  Severity: ").Append(Severity).Append("\n");
            sb.Append("}\n");
            return sb.ToString();
        }

        /// <summary>
        /// Copies the current values to another instance of the object
        /// </summary>
        /// <returns>An instance of the object with the current values copied to it</returns>
        public virtual BaseProblemDetailsResponse Copy(BaseProblemDetailsResponse copyTo)
        {
            copyTo.Title = this.Title;
            copyTo.Detail = this.Detail;
            copyTo.ExtendedDetail = this.ExtendedDetail;
            copyTo.ResultCode = this.ResultCode;
            copyTo.ResultType = this.ResultType;
            copyTo.Severity = this.Severity;

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
        public override bool Equals(object? obj)
        {
            if (obj is null) return false;
            if (ReferenceEquals(this, obj)) return true;
            return obj.GetType() == GetType() && Equals((BaseProblemDetailsResponse)obj);
        }

        /// <summary>
        /// Returns true if BaseProblemDetailsResponse instances are equal
        /// </summary>
        /// <param name="other">Instance of BaseProblemDetailsResponse to be compared</param>
        /// <returns>Boolean</returns>
        public virtual bool Equals(BaseProblemDetailsResponse? other)
        {
            if (other is null) return false;
            if (ReferenceEquals(this, other)) return true;

            return
                
                (
                    Title == other.Title ||
                    Title != null &&
                    Title.Equals(other.Title)
                ) &&
                (
                    Detail == other.Detail ||
                    Detail != null &&
                    Detail.Equals(other.Detail)
                ) &&
                (
                    ExtendedDetail == other.ExtendedDetail ||
                    ExtendedDetail != null &&
                    ExtendedDetail.Equals(other.ExtendedDetail)
                ) &&
                (
                    ResultCode == other.ResultCode ||
                    ResultCode != null &&
                    ResultCode.Equals(other.ResultCode)
                ) &&
                (
                    ResultType == other.ResultType ||
                    ResultType != null &&
                    ResultType.Equals(other.ResultType)
                ) &&
                (
                    Severity == other.Severity ||
                    Severity != null &&
                    Severity.Equals(other.Severity)
                );
        }

        /// <summary>
        /// Gets the hash code
        /// </summary>
        /// <returns>Hash code</returns>
        public override int GetHashCode()
        {
            unchecked
            {
                var hashCode = 41;
                if (Title != null)
                  hashCode = hashCode * 59 + Title.GetHashCode();
                if (Detail != null)
                  hashCode = hashCode * 59 + Detail.GetHashCode();
                if (ExtendedDetail != null)
                  hashCode = hashCode * 59 + ExtendedDetail.GetHashCode();
                if (ResultCode != null)
                  hashCode = hashCode * 59 + ResultCode.GetHashCode();
                if (ResultType != null)
                  hashCode = hashCode * 59 + ResultType.GetHashCode();
                if (Severity != null)
                  hashCode = hashCode * 59 + Severity.GetHashCode();

                return hashCode;
            }
        }

        #region Operators
        #pragma warning disable 1591

        public static bool operator ==(BaseProblemDetailsResponse left, 
          BaseProblemDetailsResponse right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(BaseProblemDetailsResponse left, 
          BaseProblemDetailsResponse right)
        {
            return !Equals(left, right);
        }

        #pragma warning restore 1591
        #endregion Operators
    }
}
