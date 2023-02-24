using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;
using System.Text.Json;

namespace OpenSystem.Core.Application.Models.DTOs
{
    /// <summary>
    /// A model for API field errors.
    /// </summary>
    [DataContract]
    public class ErrorResponseField : IEquatable<ErrorResponseField>
    {
        /// <summary>
        /// A URI reference [RFC3986](https://www.rfc-editor.org/rfc/rfc3986) that identifies the problem type. This specification encourages that, when dereferenced, it provide human-readable documentation for the problem type (e.g., using HTML [W3C.REC-html5-20141028](https://www.rfc-editor.org/rfc/rfc7807#ref-W3C.REC-html5-20141028)). When this member is not present, its value is assumed to be &#x60;about:blank&#x60;.
        /// </summary>
        /// <value>A URI reference [RFC3986](https://www.rfc-editor.org/rfc/rfc3986) that identifies the problem type. This specification encourages that, when dereferenced, it provide human-readable documentation for the problem type (e.g., using HTML [W3C.REC-html5-20141028](https://www.rfc-editor.org/rfc/rfc7807#ref-W3C.REC-html5-20141028)). When this member is not present, its value is assumed to be &#x60;about:blank&#x60;.</value>
        [Required]
        [DataMember(Name="name", EmitDefaultValue=false)]
        public string Name { get; set; }

        /// <summary>
        /// List of errors for this specific field
        /// </summary>
        [DataMember(Name="errors", EmitDefaultValue=false)]
        public List<string> Errors { get; set; } = new List<string>();

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class ErrorResponseField {\n");
            sb.Append("  Name: ").Append(Name).Append("\n");
            sb.Append("  Errors: ").Append(Errors.ToString()).Append("\n");
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
            return obj.GetType() == GetType() && Equals((ErrorResponseField)obj);
        }

        /// <summary>
        /// Returns true if ErrorResponseField instances are equal
        /// </summary>
        /// <param name="other">Instance of ErrorResponseField to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(ErrorResponseField other)
        {
            if (other is null) return false;
            if (ReferenceEquals(this, other)) return true;

            return
                (
                    Name == other.Name ||
                    Name != null &&
                    Name.Equals(other.Name)
                ) &&
                (
                    Errors == other.Errors ||
                    Errors != null &&
                    Errors.Equals(other.Errors)
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
                if (Name != null)
                  hashCode = hashCode * 59 + Name.GetHashCode();
                if (Errors != null)
                  hashCode = hashCode * 59 + Errors.GetHashCode();
                return hashCode;
            }
        }

        public static bool operator ==(ErrorResponseField left,
          ErrorResponseField right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(ErrorResponseField left,
          ErrorResponseField right)
        {
            return !Equals(left, right);
        }
    }
}
