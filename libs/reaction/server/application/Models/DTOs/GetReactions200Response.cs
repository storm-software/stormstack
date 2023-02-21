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
using OpenSystem.Core.Application.Helpers;

namespace OpenSystem.Reaction.Application.Models.DTOs
{ 
    /// <summary>
    /// 
    /// </summary>
    [DataContract]
    public class GetReactions200Response : IEquatable<GetReactions200Response>
    {
        /// <summary>
        /// The current page number of the selected data
        /// </summary>
        /// <value>The current page number of the selected data</value>
        [Required]
        [DataMember(Name = "pageNumber", EmitDefaultValue = false)]
        public int PageNumber { get; set; }

        /// <summary>
        /// The size of the current page
        /// </summary>
        /// <value>The size of the current page</value>
        [Required]
        [DataMember(Name = "pageSize", EmitDefaultValue = false)]
        public int PageSize { get; set; }

        /// <summary>
        /// The total number of records in the data set
        /// </summary>
        /// <value>The total number of records in the data set</value>
        [Required]
        [DataMember(Name = "recordsTotal", EmitDefaultValue = false)]
        public int RecordsTotal { get; set; }

        /// <summary>
        /// The number of records filtered from the data set
        /// </summary>
        /// <value>The number of records filtered from the data set</value>
        [Required]
        [DataMember(Name = "recordsFiltered", EmitDefaultValue = false)]
        public int RecordsFiltered { get; set; }

        /// <summary>
        /// Gets or Sets Data
        /// </summary>
        [Required]
        [DataMember(Name = "data", EmitDefaultValue = false)]
        public List<ReactionDetailRecord> Data { get; set; }

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class GetReactions200Response {\n");
            sb.Append("  PageNumber: ").Append(PageNumber).Append("\n");
            sb.Append("  PageSize: ").Append(PageSize).Append("\n");
            sb.Append("  RecordsTotal: ").Append(RecordsTotal).Append("\n");
            sb.Append("  RecordsFiltered: ").Append(RecordsFiltered).Append("\n");
            sb.Append("  Data: ").Append(Data).Append("\n");
            sb.Append("}\n");
            return sb.ToString();
        }

        /// <summary>
        /// Copies the current values to another instance of the object
        /// </summary>
        /// <returns>An instance of the object with the current values copied to it</returns>
        public GetReactions200Response Copy(GetReactions200Response? copyTo)
        {
            if (copyTo == null)
              copyTo = new GetReactions200Response();

            copyTo.PageNumber = this.PageNumber;
            copyTo.PageSize = this.PageSize;
            copyTo.RecordsTotal = this.RecordsTotal;
            copyTo.RecordsFiltered = this.RecordsFiltered;
            copyTo.Data = this.Data;

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
            return obj.GetType() == GetType() && Equals((GetReactions200Response)obj);
        }

        /// <summary>
        /// Returns true if GetReactions200Response instances are equal
        /// </summary>
        /// <param name="other">Instance of GetReactions200Response to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(GetReactions200Response other)
        {
            if (other is null) return false;
            if (ReferenceEquals(this, other)) return true;

            return 
                (
                    PageNumber == other.PageNumber ||
                    
                    PageNumber.Equals(other.PageNumber)
                ) && 
                (
                    PageSize == other.PageSize ||
                    
                    PageSize.Equals(other.PageSize)
                ) && 
                (
                    RecordsTotal == other.RecordsTotal ||
                    
                    RecordsTotal.Equals(other.RecordsTotal)
                ) && 
                (
                    RecordsFiltered == other.RecordsFiltered ||
                    
                    RecordsFiltered.Equals(other.RecordsFiltered)
                ) && 
                (
                    Data == other.Data ||
                    Data != null &&
                    other.Data != null &&
                    Data.SequenceEqual(other.Data)
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
                    
                    hashCode = hashCode * 59 + PageNumber.GetHashCode();
                    
                    hashCode = hashCode * 59 + PageSize.GetHashCode();
                    
                    hashCode = hashCode * 59 + RecordsTotal.GetHashCode();
                    
                    hashCode = hashCode * 59 + RecordsFiltered.GetHashCode();
                    if (Data != null)
                    hashCode = hashCode * 59 + Data.GetHashCode();
                return hashCode;
            }
        }

        #region Operators
        #pragma warning disable 1591

        public static bool operator ==(GetReactions200Response left, GetReactions200Response right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(GetReactions200Response left, GetReactions200Response right)
        {
            return !Equals(left, right);
        }

        #pragma warning restore 1591
        #endregion Operators
    }
}
