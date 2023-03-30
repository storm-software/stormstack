using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using OpenSystem.Core.Infrastructure.WebApi.Constants;

namespace OpenSystem.Core.Infrastructure.WebApi.Extensions
{
    public static class HttpContextExtensions
    {
        private static readonly MediaTypeHeaderValue _jsonMediaType =
            new(HttpContentTypeConstants.Json);

        /// <summary>
        /// Determines if the request accepts responses formatted as JSON via the <c>Accepts</c> header.
        /// </summary>
        /// <param name="httpRequest">The <see cref="HttpRequest"/>.</param>
        /// <returns><c>true</c> if the <c>Accept</c> header contains a media type compatible with "application/json".</returns>
        public static bool AcceptsJson(this HttpRequest httpRequest) =>
            Accepts(httpRequest, _jsonMediaType);

        /// <summary>
        /// Determines if the request accepts responses formatted as the specified media type via the <c>Accepts</c> header.
        /// </summary>
        /// <param name="httpRequest">The <see cref="HttpRequest"/>.</param>
        /// <param name="mediaType">The media type.</param>
        /// <returns><c>true</c> if the <c>Accept</c> header contains a compatible media type.</returns>
        public static bool Accepts(this HttpRequest httpRequest, string mediaType) =>
            Accepts(httpRequest, new MediaTypeHeaderValue(mediaType));

        /// <summary>
        /// Determines if the request accepts responses formatted as the specified media type via the <c>Accepts</c> header.
        /// </summary>
        /// <param name="httpRequest">The <see cref="HttpRequest"/>.</param>
        /// <param name="mediaType">The <see cref="MediaTypeHeaderValue"/>.</param>
        /// <returns><c>true</c> if the <c>Accept</c> header contains a compatible media type.</returns>
        public static bool Accepts(this HttpRequest httpRequest, MediaTypeHeaderValue mediaType)
        {
            if (httpRequest.GetTypedHeaders().Accept is { Count: > 0 } acceptHeader)
            {
                for (var i = 0; i < acceptHeader.Count; i++)
                {
                    var acceptHeaderValue = acceptHeader[i];

                    if (mediaType.IsSubsetOf(acceptHeaderValue))
                        return true;
                }
            }

            return false;
        }

        public static async Task<string> GetRequestBodyAsync(this HttpRequest request)
        {
            var httpMethodsWithRequestBody = new[]
            {
                HttpRequestTypeConstants.Post,
                HttpRequestTypeConstants.Put,
                HttpRequestTypeConstants.Patch
            };
            var hasRequestBody = httpMethodsWithRequestBody.Any(
                x => x.Equals(request.Method.ToUpper())
            );
            string requestBody = default;

            if (hasRequestBody)
            {
                request.EnableBuffering();

                using var memoryStream = new MemoryStream();
                await request.Body.CopyToAsync(memoryStream);
                requestBody = Encoding.UTF8.GetString(memoryStream.ToArray());
                request.Body.Seek(0, SeekOrigin.Begin);
            }
            return requestBody;
        }

        public static async Task WriteResponseAsync(this HttpContext context, object body)
        {
            var bodyText = body.ToString();
            context.Response.ContentLength =
                bodyText != null ? Encoding.UTF8.GetByteCount(bodyText) : 0;

            await context.Response.WriteAsync(bodyText);
        }

        public static async Task WriteJsonResponseAsync(
            this HttpContext context,
            int httpStatusCode,
            string jsonString
        )
        {
            context.Response.StatusCode = httpStatusCode;
            context.Response.ContentType = HttpContentTypeConstants.Json;
            context.Response.ContentLength =
                jsonString != null ? Encoding.UTF8.GetByteCount(jsonString) : 0;

            await context.Response.WriteAsync(jsonString);
        }

        /// <summary>
        /// Get request parameters from context
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static object? GetRequestBody(this HttpContext context)
        {
            return context.Items["Request"];
        }

        /// <summary>
        /// Get request parameters from context.
        /// </summary>
        /// <param name="context"></param>
        /// <typeparam name="TRequest"></typeparam>
        /// <returns></returns>
        public static TRequest? GetRequestBody<TRequest>(this HttpContext context)
            where TRequest : class
        {
            return context.Items["Request"] as TRequest;
        }
    }
}
