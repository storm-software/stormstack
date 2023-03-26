namespace OpenSystem.Core.Application.Attributes
{
    public sealed class AddCommandAttribute : RequestTypeAttribute
    {
        private const string HttpMethod = "POST";

        public AddCommandAttribute(string template)
            : base(HttpMethod, template) { }

        public AddCommandAttribute()
            : base(HttpMethod, "/") { }
    }
}
