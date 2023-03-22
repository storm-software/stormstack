using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Application.Models.DTOs;
using OpenSystem.Core.Application.Utilities;
using OpenSystem.Core.Domain.Constants;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Application.Services
{
    internal class ProblemDetailsApplicationModelProvider
      : IApplicationModelProvider
    {
        public ProblemDetailsApplicationModelProvider()
        {
            var defaultErrorResponseType = new ProducesErrorResponseTypeAttribute(typeof(ProblemDetailsResponse));

            ActionModelConventions = new List<IActionModelConvention>
            {
                new ApiConventionApplicationModelConvention(defaultErrorResponseType),
                new ProblemDetailsResultFilterConvention()
            };
        }

        public int Order => -1000 + 200;

        private List<IActionModelConvention> ActionModelConventions { get; }

        public void OnProvidersExecuting(ApplicationModelProviderContext context)
        {
            foreach (var controller in context.Result.Controllers)
            {
                if (!IsApiController(controller))
                {
                    continue;
                }

                foreach (var action in controller.Actions)
                {
                    foreach (var convention in ActionModelConventions)
                    {
                        convention.Apply(action);
                    }
                }
            }
        }

        private static bool IsApiController(ControllerModel controller)
        {
            if (controller.Attributes.OfType<IApiBehaviorMetadata>().Any())
            {
                return true;
            }

            var assembly = controller.ControllerType.Assembly;
            var attributes = assembly.GetCustomAttributes();

            return attributes.OfType<IApiBehaviorMetadata>().Any();
        }

        void IApplicationModelProvider.OnProvidersExecuted(ApplicationModelProviderContext context)
        {
            // Not needed.
        }
    }

    internal class ProblemDetailsResultFilterConvention
      : IActionModelConvention
    {
        private readonly ProblemDetailsResultFilterFactory _factory = new();

        public void Apply(ActionModel action)
        {
            action.Filters.Add(_factory);
        }
    }

    internal class ProblemDetailsResultFilterFactory :
      IFilterFactory, IOrderedFilter
    {
        public bool IsReusable => true;

        /// <summary>
        /// The same order as the built-in ClientErrorResultFilterFactory.
        /// </summary>
        public int Order => -2000;

        public IFilterMetadata CreateInstance(IServiceProvider serviceProvider)
        {
            return ActivatorUtilities.CreateInstance<ProblemDetailsResultFilter>(serviceProvider);
        }
    }

    internal class ProblemDetailsResultFilter
      : IAlwaysRunResultFilter, IOrderedFilter
    {
        public ProblemDetailsResultFilter(IProblemDetailsResponseFactory factory)
        {
            _factory = factory;
        }

        /// <summary>
        /// Order is set to 1 so that execution is after <see cref="ProducesAttribute"/>, which clears and sets ObjectResult.ContentTypes
        /// </summary>
        public int Order => 1;

        private readonly IProblemDetailsResponseFactory _factory;

        public void OnResultExecuting(ResultExecutingContext context)
        {
            // Only handle ObjectResult for now.
            if (context.Result is not ObjectResult result)
                return;

            if (result.Value is ProblemDetailsResponse problemDetails)
            {

                // Add defaults, like trace ID, if user has supplied a ProblemDetails instance.
                problemDetails = _factory.EnrichProblemDetails(context.HttpContext,
                  ref problemDetails);
                return;
            }

            // This is (most likely) a result of calling (some subclass of)
            // ObjectResult(ModelState) which indicates a validation error.
            if (result.Value is SerializableError error)
            {
                problemDetails = _factory.CreateProblemDetailsResponse(context.HttpContext,
                  error.Keys.Select(key => FieldValidationResult.Failure(key,
                    typeof(ResultCodeValidation),
                    ResultCodeValidation.OneOrMoreValidationFailuresHaveOccurred,
                    error.TryGetValue(key,
                      out object value) ? value : null,
                    ResultSeverityTypes.Error,
                    String.Join(Literals.NewLine,
                      error.Values.ToList()))).ToList(),
                      result.StatusCode);
                context.Result = CreateResult(context,
                  problemDetails);
                return;
            }

            // Make sure the result should be treated as a problem.
            if (!HttpUtility.IsProblemStatusCode(result.StatusCode))
            {
                return;
            }

            // If the result is a string, we treat it as the "detail" property.
            if (result.Value is string detail)
            {
                problemDetails = _factory.CreateProblemDetailsResponse(context.HttpContext,
                  result.StatusCode,
                  detail: detail);
                context.Result = CreateResult(context,
                  problemDetails);
                return;
            }

            // If the result is an exception, we treat it as if it's been thrown.
            if (result.Value is Exception exception)
            {
                // Set the response status code because it might be used for mapping inside the factory.
                context.HttpContext.Response.StatusCode = result.StatusCode ?? StatusCodes.Status500InternalServerError;

                var details = AsyncHelper.RunSync(async () => await _factory.CreateExceptionProblemDetailsAsync(context.HttpContext,
                exception));

                // Devs can choose to ignore errors by returning null.
                if (details is null)
                {
                    return;
                }
                else
                {
                  context.Result = CreateResult(context,
                    details);
                }
            }
        }

        void IResultFilter.OnResultExecuted(ResultExecutedContext context)
        {
            // Not needed.
        }

        private ObjectResult CreateResult(ActionContext context,
          ProblemDetailsResponse? problemDetails)
        {
          return _factory.GetObjectResult(context.HttpContext,
            problemDetails);
        }
    }
}
