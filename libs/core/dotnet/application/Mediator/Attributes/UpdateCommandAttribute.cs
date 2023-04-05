namespace OpenSystem.Core.Application.Mediator.Attributes
{
    public sealed class UpdateCommandAttribute : RequestTypeAttribute
    {
        private const string HttpMethod = "PUT";

        public UpdateCommandAttribute(string template)
            : base(HttpMethod, template) { }

        public UpdateCommandAttribute()
            : base(HttpMethod, "/") { }
    }
}
