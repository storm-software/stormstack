using OpenSystem.Core.Application.Enums;

namespace OpenSystem.Core.Application.Attributes
{
    /// <summary>
    /// Bind property value from request body. Only support JSON content.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public sealed class PayloadAttribute : BaseSourceAttribute
    {
        /// <summary>
        /// Bind property value from request body.
        /// </summary>
        public PayloadAttribute()
            : base(null, BindingSource.Payload) { }
    }
}
