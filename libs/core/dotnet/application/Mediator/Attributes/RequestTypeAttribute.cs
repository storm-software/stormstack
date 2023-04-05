namespace OpenSystem.Core.Application.Mediator.Attributes
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true, Inherited = true)]
    public class RequestTypeAttribute : Attribute
    {
        public string Template { get; }

        public string? Name { get; init; }

        public string? GroupName { get; init; }

        public IEnumerable<string> SupportedMethods { get; }

        public RequestTypeAttribute(string httpMethod, string template)
        {
            SupportedMethods = new[] { httpMethod };
            Template = template;
        }

        public RequestTypeAttribute(IEnumerable<string> supportedMethods, string template)
        {
            SupportedMethods = supportedMethods;
            Template = template;
        }
    }
}
