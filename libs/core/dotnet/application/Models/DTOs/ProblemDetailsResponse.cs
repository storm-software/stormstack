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
using OpenSystem.Core.Domain.Extensions;

namespace OpenSystem.Core.Application.Models.DTOs
{
    /// <summary>
    /// A model for API errors inline with the [RFC 7807](https://www.rfc-editor.org/rfc/rfc7807) specification.
    /// </summary>
    [DataContract]
    public class ProblemDetailsResponse 
      : BaseProblemDetailsResponse, IEquatable<ProblemDetailsResponse>
    {
        /// <summary>
        /// A URI reference [RFC3986](https://www.rfc-editor.org/rfc/rfc3986) that identifies the problem type. This specification encourages that, when dereferenced, it provide human-readable documentation for the problem type (e.g., using HTML [W3C.REC-html5-20141028](https://www.rfc-editor.org/rfc/rfc7807#ref-W3C.REC-html5-20141028)). When this member is not present, its value is assumed to be &#x60;about:blank&#x60;.
        /// </summary>
        /// <value>A URI reference [RFC3986](https://www.rfc-editor.org/rfc/rfc3986) that identifies the problem type. This specification encourages that, when dereferenced, it provide human-readable documentation for the problem type (e.g., using HTML [W3C.REC-html5-20141028](https://www.rfc-editor.org/rfc/rfc7807#ref-W3C.REC-html5-20141028)). When this member is not present, its value is assumed to be &#x60;about:blank&#x60;.</value>
        [Required]
        [DataMember(Name = "type", EmitDefaultValue = false)]
        public new string Type { get; set; } = "about:blank";

        /// <summary>
        /// A list of fields that are responsible for the problem in some way (i.e. failed a validation, caused an exception, etc.).
        /// </summary>
        /// <value>A list of fields that are responsible for the problem in some way (i.e. failed a validation, caused an exception, etc.).</value>
        [DataMember(Name = "errors", EmitDefaultValue = true)]
        public new IDictionary<string, ProblemDetailsFieldResponse?> Errors { get; } = new Dictionary<string, ProblemDetailsFieldResponse?>();
        
        [Required]
        [DataMember(Name = "traceId", EmitDefaultValue = false)]
        public string TraceId { get; set; }
       
        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();

            sb.Append("class ProblemDetailsResponse {\n");
            sb.Append("  Type: ").Append(Type).Append("\n");
            sb.Append("  Instance: ").Append(Instance).Append("\n"); 
            sb.Append("  Title: ").Append(Title).Append("\n");
            sb.Append("  Detail: ").Append(Detail).Append("\n");
            sb.Append("  ExtendedDetail: ").Append(ExtendedDetail).Append("\n");
            sb.Append("  TraceId: ").Append(TraceId).Append("\n");
            sb.Append("  ResultCode: ").Append(ResultCode).Append("\n");
            sb.Append("  ResultType: ").Append(ResultType).Append("\n");
            sb.Append("  Severity: ").Append(Severity).Append("\n");
            sb.Append("  Errors: ").Append(Errors).Append("\n");        
            sb.Append("}\n");

            return sb.ToString();
        }

        /// <summary>
        /// Copies the current values to another instance of the object
        /// </summary>
        /// <returns>An instance of the object with the current values copied to it</returns>
        public ProblemDetailsResponse Copy(ProblemDetailsResponse? copyTo)
        {
            if (copyTo == null)
              copyTo = new ProblemDetailsResponse();

            copyTo = (ProblemDetailsResponse)base.Copy(copyTo);
            copyTo.Type = this.Type;
            copyTo.Instance = this.Instance;
            copyTo.TraceId = this.TraceId;
            if (this.Errors != null)
              this.Errors.CopyTo(copyTo.Errors);

            return copyTo;
        }

        /// <summary>
        /// Returns true if objects are equal
        /// </summary>
        /// <param name="obj">Object to be compared</param>
        /// <returns>Boolean</returns>
        public override bool Equals(object? obj)
        {
            if (obj is null) 
              return false;
            if (ReferenceEquals(this, obj)) 
              return true;
            return obj.GetType() == GetType() && 
              Equals((ProblemDetailsResponse)obj);
        }

        /// <summary>
        /// Returns true if ProblemDetailsResponse instances are equal
        /// </summary>
        /// <param name="other">Instance of ProblemDetailsResponse to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(ProblemDetailsResponse? other)
        {
            return base.Equals(other) &&
              (
                  Type == other.Type ||
                  Type != null &&
                  Type.Equals(other.Type)
              ) &&
              (
                  Instance == other.Instance ||
                  Instance != null &&
                  Instance.Equals(other.Instance)
              ) &&
              (
                  Errors == other.Errors ||
                  Errors != null &&
                  Errors.Equals(other.Errors)
              ) &&
              (
                  TraceId == other.TraceId ||
                  TraceId != null &&
                  TraceId.Equals(other.TraceId)
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
            var hashCode = base.GetHashCode();
            if (Type != null)
              hashCode = hashCode * 59 + Type.GetHashCode();
            if (Instance != null)
              hashCode = hashCode * 59 + Instance.GetHashCode();
            if (TraceId != null)
              hashCode = hashCode * 59 + TraceId.GetHashCode();
            if (Errors != null)
              hashCode = hashCode * 59 + Errors.GetHashCode();
           
            return hashCode;
          }
        }

        #region Operators
        #pragma warning disable 1591

        public static bool operator ==(ProblemDetailsResponse left, 
          ProblemDetailsResponse right)
        {
            return Equals(left, 
              right);
        }

        public static bool operator !=(ProblemDetailsResponse left, 
          ProblemDetailsResponse right)
        {
            return !Equals(left, 
              right);
        }

        #pragma warning restore 1591
        #endregion Operators
    }
}
