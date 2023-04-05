namespace OpenSystem.Core.Application.Mediator.Attributes
{
    public class QueryAttribute : RequestTypeAttribute
    {
        private const string HttpMethod = "GET";

        public QueryAttribute(string template)
            : base(HttpMethod, template) { }

        public QueryAttribute()
            : base(HttpMethod, "/") { }
    }
}
