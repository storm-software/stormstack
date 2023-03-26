using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using OpenSystem.Core.Application.Models.DTOs;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc;
using OpenSystem.Core.Domain.Constants;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Application.Extensions;
using OpenSystem.Core.Domain.Exceptions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpenSystem.Core.Domain.Settings;
using System.Diagnostics;
using OpenSystem.Core.Application.Interfaces;

namespace OpenSystem.Core.Infrastructure.Services
{
  public class ProblemDetailsResponseFactory
    : IProblemDetailsResponseFactory
  {
    public static string GetStatusCodeUrl(int statusCode,
      string statusCodesUrl = "https://httpstatuses.com") => $"{statusCodesUrl.RemoveSuffix("/")}/{statusCode}";
      
    public static string GetStatusCodeTitle(int statusCode) => ReasonPhrases.GetReasonPhrase(statusCode);

    public static string GetTraceId(HttpContext context) => Activity.Current?.Id ?? context.TraceIdentifier;

    public static bool ShouldIncludeDetails(HttpContext context, 
      ErrorHandlingSettings? settings = null) => context
        .RequestServices
        .GetRequiredService<IHostEnvironment>()
        .IsDevelopment();

    private readonly ILogger<ProblemDetailsResponseFactory> _logger;

    private readonly ErrorHandlingSettings _settings;

    public ProblemDetailsResponseFactory(ILogger<ProblemDetailsResponseFactory> logger,
      IOptions<ErrorHandlingSettings> settings)
    {
      _logger = logger;
      _settings = settings.Value;
    }

    public async Task<ProblemDetailsResponse> CreateAsync(HttpContext context,
      Exception error)
    {
        Result result = Result.Failure(typeof(ResultCodeGeneral),
          ResultCodeGeneral.GeneralError,
          null,
          null,
          ResultSeverityTypes.Error);

        if (error is Exception exception)
        {
          result.HelpLink = exception.HelpLink;
          result.StackTrace = exception.StackTrace;
          result.ExtendedDetail = exception.Message;

          if (error is BaseException baseException)
          {
            result.Type = baseException.ResultType;
            result.Code = baseException.ResultCode;
            result.ExtendedDetail = baseException.ExtendedMessage;
            result.Severity = baseException.Severity;
          }            
        }
      
        try
        {
            return await CreateAsync(context,
              result);
        }
        catch (Exception e)
        {
            // Failed to get exception details for the specific exception.
            // Just log the failure and return the original problem details below.
            _logger.ProblemDetailsFactoryException(e);
        }

        return await CreateAsync(context,
          typeof(ResultCodeApplication).FullName,      
          ResultCodeApplication.FailedFormattingResponse);
    }

       /*public ProblemDetailsResponse CreateProblemDetailsResponse(HttpContext context,
        int? statusCode = (int)HttpStatusCode.InternalServerError,
        string? title = null,
        string? type = null,
        string? detail = "A generic error has occurred on the server.",
        string? instance = null)
    {
        return (ProblemDetailsResponse)CreateProblemDetails(context,
          statusCode,
          title,
          type,
          detail,
          instance);
    }

    public override ValidationProblemDetails CreateValidationProblemDetails(HttpContext context,
        ModelStateDictionary modelStateDictionary,
        int? statusCode = (int)HttpStatusCode.UnprocessableEntity,
        string? title = null,
        string? type = null,
        string? detail = "The request has failed a server-side validation.",
        string? instance = null)
    {
        return AsyncHelper.RunSync(async () => await CreateAsync(context,
          typeof(ResultCodeValidation),
            ResultCodeValidation.OneOrMoreValidationFailuresHaveOccurred,
            detail,
            null,
            ResultSeverityTypes.Error,
            null,
            (IList<FieldValidationResult>?)modelStateDictionary.Keys.Select(key => FieldValidationResult.Failure(key,
                typeof(ResultCodeValidation),
                ResultCodeValidation.OneOrMoreValidationFailuresHaveOccurred,
                modelStateDictionary[key]?.AttemptedValue,
                ResultSeverityTypes.Error,
                String.Join(Literals.NewLine,
                  modelStateDictionary[key].Errors.ToList())))),
          HttpUtility.GetTraceId(context),
          instance ?? context.Request.Path,
          statusCode ?? context.Response.StatusCode,
          type));
    }*/

    public ObjectResult GetObjectResult(HttpContext context,
        ProblemDetailsResponse problemDetails)
    {
      /*var problemDetailsResponse = new ProblemDetailsResponse();

      problemDetailsResponse = EnrichProblemDetails(context,
        ref problemDetailsResponse);*/

      var objResult = new ObjectResult(problemDetails)
      {
          StatusCode = problemDetails.Status,
      };

      objResult.ContentTypes.Add(HttpContentTypeConstants.ProblemJson);
      objResult.ContentTypes.Add(HttpContentTypeConstants.ProblemXml);

      return objResult;
    }

    public async Task<ProblemDetailsResponse> CreateAsync(HttpContext context,
      Result result)
    {
      return await CreateAsync(context,
        result.Type,
        result.Code,
        result.ExtendedDetail,
        context.Response.StatusCode,
        null,
        result.HelpLink,
        null,
        result.StackTrace,
        result.Severity,
        result.Fields);
    }

    public async Task<ProblemDetailsResponse> CreateAsync(HttpContext context,
      string resultType,
      int resultCode,
      string? extendedDetail = null,
      int? statusCode = null,
      string? instance = null,
      string? helpLink = null,
      string? traceId = null,
      string? stackTrace = null,
      ResultSeverityTypes? severity = null,
      IList<FieldValidationResult>? errors = null)
    {
      if (!ProblemDetailsResponseFactory.ShouldIncludeDetails(context,
          _settings))
      {
        stackTrace = null;
        extendedDetail = null;
      }

      statusCode ??= context.Response.StatusCode;
      return await CreateAsync(resultType,
        resultCode,
        (int)statusCode,
        extendedDetail,
        !string.IsNullOrEmpty(instance)
            ? instance
            : context.Request.Path,
        !string.IsNullOrEmpty(helpLink)
          ? helpLink
          : ProblemDetailsResponseFactory.GetStatusCodeUrl((int)statusCode),
        !string.IsNullOrEmpty(traceId)
          ? traceId
          : ProblemDetailsResponseFactory.GetTraceId(context),
        stackTrace,
        severity,
        errors);
    }

    public async Task<ProblemDetailsResponse> CreateAsync(string resultType,
      int resultCode,
      int statusCode,
      string? extendedDetail,
      string instance,
      string helpLink,
      string traceId,
      string? stackTrace = null,
      ResultSeverityTypes? severity = null,
      IList<FieldValidationResult>? errors = null)
    {
      var response = new ProblemDetailsResponse {
          TraceId = traceId,
          Type = helpLink,
          Instance = !string.IsNullOrEmpty(instance)
            ? instance
            : "/",
          Status = statusCode,
          ResultType = resultType,
          ResultCode = resultCode,
          ExtendedDetail = extendedDetail,
          Severity = ParseSeverity(severity),
      };

      if (errors != null &&
        errors.Count > 0)
          await errors.ForEachAsync(async field => {
            var responseField = await CreateFieldAsync(field.FieldName,
              field.AttemptedValue,
              field.Type,
              field.Code,
              instance,
              field.Detail,
              null,
              field.Severity);
            if (response.Errors.ContainsKey(responseField.Name))
              response.Errors[responseField.Name] = responseField;
            else
              response.Errors.Add(responseField.Name,
                responseField);
          }); 

      return response;
    }

    public Task<ProblemDetailsFieldResponse> CreateFieldAsync(string name,
      object? attemptedValue,
      string resultType,
      int resultCode,
      string instance,
      string? detail,
      string? extendedDetail = null,
      ResultSeverityTypes? severity = null) {
        return Task.FromResult<ProblemDetailsFieldResponse>(new ProblemDetailsFieldResponse {
          Name = name,
          Title = detail,
          AttemptedValue = attemptedValue,
          ResultType = resultType,
          ResultCode = resultCode,
          Detail = detail,
          ExtendedDetail = extendedDetail,
          Severity = ParseSeverity(severity),
          Instance = instance,
        });
      }

    private BaseProblemDetailsResponse.SeverityTypesOptions ParseSeverity(ResultSeverityTypes? Severity = ResultSeverityTypes.Error) {
      if (!Enum.TryParse(typeof(BaseProblemDetailsResponse.SeverityTypesOptions),
        Severity.ToString(),
        false,
        out object? objSeverity))
        objSeverity = BaseProblemDetailsResponse.SeverityTypesOptions.Error;

      return (BaseProblemDetailsResponse.SeverityTypesOptions)objSeverity;
    }  
  }
}

