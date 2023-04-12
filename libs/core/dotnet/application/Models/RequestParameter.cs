using System.Reflection;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Models
{
    public class RequestParameter
    {
        // internal bool HasQueryParameters { get; set; }
        // internal bool HasRouteParameters { get; set; }
        // internal bool HasHeaderParameters { get; set; }

        public bool ExpectFormFile { get; set; }

        public bool ExpectFormFileCollection { get; set; }

        public bool ExpectFormBody { get; set; }

        public bool ExpectJsonBody { get; set; }

        public PropertySetterCollection Identifiers { get; } = new();

        public PropertySetterCollection QueryFilters { get; } = new();

        public PropertySetterCollection Metadata { get; } = new();

        public PropertySetterCollection Forms { get; } = new();

        public List<PropertyInfo> Payload { get; set; } = new();

        public PropertyInfo? FormFile { get; set; }

        public PropertyInfo? FormFileCollection { get; set; }

        public PropertyInfo? Context { get; set; }

        public PropertyInfo? Request { get; set; }

        public PropertyInfo? Response { get; set; }
    }
}
