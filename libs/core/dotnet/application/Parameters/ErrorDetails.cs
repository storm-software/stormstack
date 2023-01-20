namespace OpenSystem.Core.DotNet.Application.Parameters
{
    /// <summary>
    /// A model for API errors inline with the [RFC 7807](https://www.rfc-editor.org/rfc/rfc7807) specification.
    /// </summary>
    public class ErrorDetails
    {
        /// <summary>
        /// A URI reference [RFC3986](https://www.rfc-editor.org/rfc/rfc3986)
        /// that identifies the problem type. This specification encourages that,
        /// when dereferenced, it provide human-readable documentation for the
        /// problem type (e.g., using HTML [W3C.REC-html5-20141028](https://www.rfc-editor.org/rfc/rfc7807#ref-W3C.REC-html5-20141028)).
        /// When this member is not present, its value is assumed to be `about:blank`.
        /// </summary>
        public string Type { get; set; }

        /// <summary>
        /// A short, human-readable summary of the problem type. It **SHOULD NOT**
        /// change from occurrence to occurrence of the problem, except for purposes
        /// of localization (e.g., using proactive content negotiation;
        /// see [RFC7231, Section 3.4](https://www.rfc-editor.org/rfc/rfc7231#section-3.4)).
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// A human-readable explanation specific to this occurrence of the problem.
        /// </summary>
        public string Detail { get; set; }

        /// <summary>
        /// A URI reference that identifies the specific occurrence of the problem.
        /// It may or may not yield further information if dereferenced.
        /// </summary>
        public string Instance { get; set; }

        /// <summary>
        /// A list of error messages that occurred during the request.
        /// </summary>
        public List<string> Errors { get; set; }
    }
}
