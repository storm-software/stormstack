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

namespace OpenSystem.Core.Application.Models.DTOs
{
    /// <summary>
    /// A model for API errors inline with the [RFC 7807](https://www.rfc-editor.org/rfc/rfc7807) specification.
    /// </summary>
    [DataContract]
    public class ProblemDetailsFieldResponse :
      BaseProblemDetailsResponse, IEquatable<ProblemDetailsFieldResponse>
    {
        /// <summary>
        /// A short, human-readable summary of the problem type. It **SHOULD NOT** change from occurrence to occurrence of the pro**blem, except for purposes of localization (e.g., using proactive content negotiation; see [RFC7231, Section 3.4](https://www.rfc-editor.org/rfc/rfc7231#section-3.4)).
        /// </summary>
        /// <value>A short, human-readable summary of the problem type. It **SHOULD NOT** change from occurrence to occurrence of the pro**blem, except for purposes of localization (e.g., using proactive content negotiation; see [RFC7231, Section 3.4](https://www.rfc-editor.org/rfc/rfc7231#section-3.4)).</value>
        [DataMember(Name = "name", EmitDefaultValue = true)]
        public string Name { get; set; }

        /// <summary>
        /// A human-readable explanation specific to this occurrence of the problem.
        /// </summary>
        /// <value>A human-readable explanation specific to this occurrence of the problem.</value>
        [DataMember(Name = "attemptedValue", EmitDefaultValue = true)]
        public object? AttemptedValue { get; set; }
        
        /// <summary>
        /// A short, human-readable summary of the problem type. It **SHOULD NOT** change from occurrence to occurrence of the pro**blem, except for purposes of localization (e.g., using proactive content negotiation; see [RFC7231, Section 3.4](https://www.rfc-editor.org/rfc/rfc7231#section-3.4)).
        /// </summary>
        /// <value>A short, human-readable summary of the problem type. It **SHOULD NOT** change from occurrence to occurrence of the pro**blem, except for purposes of localization (e.g., using proactive content negotiation; see [RFC7231, Section 3.4](https://www.rfc-editor.org/rfc/rfc7231#section-3.4)).</value>
        [DataMember(Name = "title", EmitDefaultValue = true)]
        public override string Title { get; set; } = "Invalid field value.";     

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();

            sb.Append("class ProblemDetailsFieldResponse {\n");
            sb.Append("  Name: ").Append(Name).Append("\n");
            sb.Append("  AttemptedValue: ").Append(AttemptedValue).Append("\n");
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
        public ProblemDetailsFieldResponse Copy(ProblemDetailsFieldResponse? copyTo)
        {
            if (copyTo == null)
              copyTo = new ProblemDetailsFieldResponse();

            copyTo = (ProblemDetailsFieldResponse)base.Copy(copyTo);
            copyTo.Name = this.Name;
            copyTo.AttemptedValue = this.AttemptedValue;

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
              Equals((ProblemDetailsFieldResponse)obj);
        }

        /// <summary>
        /// Returns true if ProblemDetailsFieldResponse instances are equal
        /// </summary>
        /// <param name="other">Instance of ProblemDetailsFieldResponse to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(ProblemDetailsFieldResponse? other)
        {
            return base.Equals(other) &&
              (
                  Name == other.Name ||
                  Name != null &&
                  Name.Equals(other.Name)
              ) &&
              (
                  AttemptedValue == other.AttemptedValue ||
                  AttemptedValue != null &&
                  AttemptedValue.Equals(other.AttemptedValue)
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
              if (Name != null)
                hashCode = hashCode * 59 + Name.GetHashCode();
              if (AttemptedValue != null)
                hashCode = hashCode * 59 + AttemptedValue.GetHashCode();

              return hashCode;
            }
        }

        #region Operators
        #pragma warning disable 1591

        public static bool operator ==(ProblemDetailsFieldResponse left, 
          ProblemDetailsFieldResponse right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(ProblemDetailsFieldResponse left, 
          ProblemDetailsFieldResponse right)
        {
            return !Equals(left, right);
        }

        #pragma warning restore 1591
        #endregion Operators
    }
}
