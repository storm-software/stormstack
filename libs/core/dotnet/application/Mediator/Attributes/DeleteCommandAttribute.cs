namespace OpenSystem.Core.Application.Mediator.Attributes
{
    public sealed class DeleteCommandAttribute : RequestTypeAttribute
    {
        private const string HttpMethod = "DELETE";

        public DeleteCommandAttribute(string template)
            : base(HttpMethod, template) { }

        public DeleteCommandAttribute()
            : base(HttpMethod, "/") { }
    }
}
