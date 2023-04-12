using System.Diagnostics;
using System.Reflection;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Routing.Patterns;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OpenSystem.Core.Application.Mediator.Attributes;
using OpenSystem.Core.Application.Enums;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Application.Models;
using OpenSystem.Core.Domain.Constants;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.Settings;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.ValueObjects;
using OpenSystem.Core.Application.Services;

namespace OpenSystem.Core.Api.ModelBinding
{
    public sealed class ParameterDictionary : TypeObjectDictionary<RequestParameter?> { }

    public static class ModelBinder
    {
        private static readonly ParameterDictionary ParameterCache = new();
        private static IJsonOptions? _jsonSerializerOptions;

        public static RequestParameter? GetRequestParameter(Type type)
        {
            return ParameterCache.TryGetValue(type, out var parameter) ? parameter : null;
        }

        public static async Task<T> BindToAsync<T>(this HttpContext context)
            where T : IBaseRequest<IResult>
        {
            return (T)await BindToAsync(context, typeof(T));
        }

        /*internal static ValueTask<object> BindToAsync(this HttpContext context, Type type)
        {
            var target = Activator.CreateInstance(type);
            if (target is null)
                throw new InvalidOperationException(
                    $"Failed to create instance of type {type.FullName}"
                );

            return BindToAsync(context, type, target);
        }*/

        public static async ValueTask<object> BindToAsync(this HttpContext context, Type type)
        {
            var memoryCache = context.RequestServices.GetService<IMemoryCache>();
            var log = context.RequestServices.GetService<ILoggerFactory>();

            if (!ParameterCache.TryGetValue(type, out var parameters) || parameters is null)
                parameters = Build(
                    type,
                    context,
                    context.RequestServices.GetService<ObjectParserCollection>()
                );

            object target = null;
            try
            {
                if (parameters.Identifiers.Any())
                {
                    var constructorParams = new List<object>();
                    var constructorParamsNames = new List<string>();
                    foreach (var property in parameters.Identifiers)
                    {
                        log?.CreateLogger("ModelBinder")
                            .LogWarning("***** Id: {Name}", property.Name);
                        if (
                            context.Request.RouteValues.TryGetValue(
                                property.Name,
                                out var routeValue
                            )
                        )
                        {
                            constructorParams.Add(routeValue);
                            constructorParamsNames.Add(property.Name);
                        }
                    }

                    log?.CreateLogger("ModelBinder")
                        .LogWarning("***** ConstructorParams: {Name}", constructorParams);
                    log?.CreateLogger("ModelBinder")
                        .LogWarning(
                            "***** ConstructorParams Type: {Name}",
                            constructorParams.GetType()
                        );
                    if (constructorParams.Any())
                    {
                        var requestConstructor = memoryCache?.GetOrCreate(
                            CacheKey.With(type, constructorParamsNames.ToArray()),
                            e =>
                            {
                                e.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1);
                                return ReflectionHelper.CompileConstructor<object>(
                                    type,
                                    constructorParams
                                );
                            }
                        );
                        log?.CreateLogger("ModelBinder")
                            .LogWarning(
                                "***** ConstructorParams: {Name}",
                                constructorParams.ToArray()
                            );
                        if (requestConstructor != null)
                            target = requestConstructor?.DynamicInvoke(constructorParams.ToArray());
                        else
                            log?.CreateLogger("ModelBinder")
                                .LogWarning("***** requestConstructor: is null");
                    }
                }
            }
            catch (Exception ex)
            {
                log?.CreateLogger("ModelBinder")
                    .LogWarning(
                        ex,
                        "Failed to create instance of type {type} with the following identifier parameters: {Identifiers}. {NewLine}Will attempt to create instance without parameters.",
                        type.FullName,
                        string.Join(",", parameters.Identifiers.Select(x => x.Name).ToArray()),
                        Literals.NewLine
                    );
            }

            if (target == null)
                target = Activator.CreateInstance(type);
            if (target is null)
                throw new InvalidOperationException(
                    $"Failed to create instance of type {type.FullName}"
                );

            foreach (var property in parameters.Identifiers)
            {
                log?.CreateLogger("ModelBinder")
                    .LogWarning("***** Identifiers: {Name}", property.Name);
                if (context.Request.RouteValues.TryGetValue(property.Name, out var routeValue))
                    property.SetValue(target, routeValue as string);
            }

            foreach (var property in parameters.QueryFilters)
            {
                if (context.Request.Query.TryGetValue(property.Name, out var queryValue))
                    property.SetValue(target, queryValue);
            }

            if (parameters.ExpectFormBody && context.Request.HasFormContentType)
            {
                foreach (var property in parameters.Forms)
                {
                    if (context.Request.Form.TryGetValue(property.Name, out var formValue))
                        property.SetValue(target, formValue);
                }
            }

            if (parameters.ExpectJsonBody && context.Request.HasJsonContentType())
            {
                _jsonSerializerOptions ??= context.RequestServices.GetService<IJsonOptions>();

                var settings = new JsonSerializerOptions();
                _jsonSerializerOptions?.Apply(settings);

                foreach (var item in parameters.Payload)
                {
                    var body = await context.Request
                        .ReadFromJsonAsync(item.PropertyType, settings)
                        .ConfigureAwait(false);
                    item.SetValue(target, body);
                }
            }

            if (parameters.ExpectFormFileCollection)
                parameters.FormFileCollection?.SetValue(target, context.Request.Form.Files);

            if (parameters.ExpectFormFile && context.Request.Form.Files.Count > 0)
            {
                // assumes only has 1 property that expect file input
                parameters.FormFile?.SetValue(target, context.Request.Form.Files[0]);
            }

            foreach (var property in parameters.Metadata)
            {
                if (context.Request.Headers.TryGetValue(property.Name, out var headerValue))
                    property.SetValue(target, headerValue);
            }

            parameters.Context?.SetValue(target, context);
            parameters.Request?.SetValue(target, context.Request);
            parameters.Response?.SetValue(target, context.Response);

            if (
                target is IBaseRequest baseRequest
                && string.IsNullOrEmpty(baseRequest.UserId?.Value)
            )
            {
                var currentUserService = context.RequestServices.GetService<ICurrentUserService>();
                if (currentUserService != null)
                    baseRequest.UserId = currentUserService.UserId;
            }

            return target;
        }

        public static RequestParameter Build(
            Type type,
            HttpContext context,
            ObjectParserCollection? parsers = null
        )
        {
            Debug.Assert(parsers != null);
            Debug.Assert(context != null);
            var parameters = new RequestParameter();
            var properties = type.GetProperties();
            var endpoint = context.GetEndpoint() as RouteEndpoint;

            var config = context.RequestServices
                .GetRequiredService<IOptions<MediatorSettings>>()
                .Value;
            foreach (var property in properties)
            {
                var bind = property.GetCustomAttribute<BaseSourceAttribute>();
                if (bind is null)
                {
                    if (!config.EnableInferredBinding)
                        continue;
                    bind = GetInferredBinding(property, endpoint!.RoutePattern);
                }
                else if (bind.Source == BindingSource.None)
                {
                    continue;
                }

                var propType = property.PropertyType;
                switch (bind?.Source)
                {
                    case BindingSource.Identifier:
                        parameters.Identifiers.Add(bind.Name, property, parsers);
                        break;
                    case BindingSource.QueryFilter:
                        parameters.QueryFilters.Add(bind.Name, property, parsers);
                        break;
                    case BindingSource.Form:
                        parameters.ExpectFormBody = true;
                        parameters.Forms.Add(bind.Name, property, parsers);
                        break;
                    case BindingSource.Metadata:
                        parameters.Metadata.Add(bind.Name, property, parsers);
                        break;
                    case BindingSource.None:
                        break;
                    case BindingSource.Payload:
                        break;
                    case BindingSource.File:
                        break;
                    case BindingSource.Unknown:
                        break;
                    case null:
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }

                if (IsHttpContext(property, parameters))
                    continue;

                if (property.GetCustomAttribute<PayloadAttribute>() != null)
                {
                    var propInterfaces = property.PropertyType.GetInterfaces();

                    if (
                        propType == typeof(IFormFileCollection)
                        || propInterfaces.Contains(typeof(IFormFileCollection))
                    )
                    {
                        parameters.ExpectFormFileCollection = true;
                        parameters.FormFile = property;
                    }
                    else if (
                        propType == typeof(IFormFile) || propInterfaces.Contains(typeof(IFormFile))
                    )
                    {
                        parameters.ExpectFormFile = true;
                        parameters.FormFile = property;
                    }
                    else
                    {
                        parameters.ExpectJsonBody = true;
                        parameters.Payload.Add(property);
                    }
                }
            }

            ParameterCache[type] = parameters;
            return parameters;
        }

        public static void ReserveSpace(Type type)
        {
            ParameterCache[type] = null;
        }

        public static void AddDefaultParsers(ObjectParserCollection collection)
        {
            collection.TryAdd(typeof(string), input => input.ToString());
            collection.TryAdd(typeof(string[]), input => input.ToArray());
            collection.TryAdd(typeof(IEnumerable<string>), input => input.ToArray());
        }

        private static BaseSourceAttribute? GetInferredBinding(
            PropertyInfo propertyInfo,
            RoutePattern pattern
        )
        {
            var propType = propertyInfo.PropertyType;
            BaseSourceAttribute? bind = null;
            if (
                propType == typeof(string)
                || propType.IsValueType
                || propType.IsPrimitive
                || propType.IsEnum
            )
            {
                // implicit binding declaration
                foreach (var parameter in pattern.Parameters)
                {
                    if (
                        !string.Equals(
                            parameter.Name,
                            propertyInfo.Name,
                            StringComparison.OrdinalIgnoreCase
                        )
                    )
                        continue;
                    bind = new IdentifierAttribute(parameter.Name);
                    break;
                }

                bind ??= new QueryFilterAttribute();
            }

            return bind;
        }

        private static bool IsHttpContext(PropertyInfo property, RequestParameter parameters)
        {
            var propType = property.PropertyType;
            if (propType == typeof(HttpContext))
            {
                parameters.Context = property;
                return true;
            }

            if (propType == typeof(HttpRequest))
            {
                parameters.Request = property;
                return true;
            }

            if (propType == typeof(HttpResponse))
            {
                parameters.Response = property;
                return true;
            }

            return false;
        }
    }
}
