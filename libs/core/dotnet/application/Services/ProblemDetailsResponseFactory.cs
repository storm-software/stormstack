using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using OpenSystem.Core.Application.Models.DTOs;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.Constants;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Application.Utilities;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Net;
using OpenSystem.Core.Application.Extensions;
using OpenSystem.Core.Domain.Exceptions;
using static OpenSystem.Core.Application.Models.DTOs.BaseProblemDetailsResponse;

namespace OpenSystem.Core.Application.Services
{
  public class ProblemDetailsResponseFactory
    : ProblemDetailsFactory, IProblemDetailsResponseFactory
  {
    private readonly ILogger<ProblemDetailsResponseFactory> _logger;

    public ProblemDetailsResponseFactory(ILogger<ProblemDetailsResponseFactory> logger)
    {
      _logger = logger;
    }

    public async virtual Task<ProblemDetailsResponse?> CreateExceptionProblemDetailsAsync(HttpContext context,
      Exception error)
    {
        var result = Result.Failure(typeof(ResultCodeGeneral),
          ResultCodeGeneral.GeneralError);
        int statusCode = (int)HttpStatusCode.InternalServerError;
        var currentPath = context.Request.Path;

        if (error is Exception exception)
        {
          if (error is BaseException baseException)
            result = (Result)baseException.Result;
          else
            result = Result.Failure(exception);

          switch (error)
          {
            case BadHttpRequestException b:
              statusCode = (int)HttpStatusCode.BadRequest;

              result.Code = ResultCodeApplication.InvalidRequestSentToServer;
              result.SetResultCodeType(typeof(ResultCodeApplication));
              result.Detail = "The provided request is not valid for the current action.";

              break;

            case ValidationException v:
              statusCode = (int)HttpStatusCode.UnprocessableEntity;

              result.Code = ResultCodeValidation.OneOrMoreValidationFailuresHaveOccurred;
              result.SetResultCodeType(typeof(ResultCodeValidation));
              result.Detail = "The request has failed a server-side validation.";

              if (v?.Errors != null &&
                v.Errors.Count > 0)
              {
                foreach(KeyValuePair<string, string[]> errorField in v.Errors.ToArray())
                {
                  result.Fields.Add(FieldValidationResult.Failure(
                    errorField.Key,
                    typeof(ResultCodeValidation),
                    ResultCodeValidation.OneOrMoreValidationFailuresHaveOccurred,
                    null,
                    ResultSeverityTypes.Error,
                    String.Join(Literals.NewLine,
                      errorField.Value.ToList())));
                }
              }

              break;

            case ForbiddenAccessException:
              statusCode = (int)HttpStatusCode.Forbidden;

              result.Code = ResultCodeSecurity.ForbiddenAccess;
              result.SetResultCodeType(typeof(ResultCodeSecurity));
              result.Detail = "The user does not have access to this resource.";

              break;

            case KeyNotFoundException:
            case NotFoundException:
              statusCode = (int)HttpStatusCode.NotFound;

              result.Code = ResultCodeApplication.RecordNotFound;
              result.SetResultCodeType(typeof(ResultCodeApplication));
              result.Detail = "The requested resource does not exist.";

              break;

            case FileExportException:
              statusCode = (int)HttpStatusCode.InternalServerError;

              result.Code = ResultCodeApplication.FileExportFailure;
              result.SetResultCodeType(typeof(ResultCodeApplication));
              result.Detail = "An error occurred while exporting a file.";

              break;

            case GeneralProcessingException:
            default:
              // unhandled error
              statusCode = (int)HttpStatusCode.InternalServerError;

              result.Code = ResultCodeGeneral.GeneralError;
              result.SetResultCodeType(typeof(ResultCodeGeneral));
              result.Detail = "A generic error has occurred on the server.";

              break;
          }

          if (!string.IsNullOrEmpty(exception.HelpLink))
            result.HelpLink = exception.HelpLink;
          if (!string.IsNullOrEmpty(exception.StackTrace))
            result.StackTrace = exception.StackTrace;
        }

        if (result.Severity == ResultSeverityTypes.None)
        {
            // Developer has explicitly ignored the problem.
            return null;
        }

        if (!HttpUtility.IncludeErrorDetails(context))
        {
          result.StackTrace = null;
          result.ExtendedDetail = null;
        }

        try
        {
            return await CreateProblemDetailsAsync(result,
              HttpUtility.GetTraceId(context),
              currentPath,
              statusCode);
        }
        catch (Exception e)
        {
            // Failed to get exception details for the specific exception.
            // Just log the failure and return the original problem details below.
            _logger.ProblemDetailsFactoryException(e);
        }

        return await CreateProblemDetailsAsync(Result.Failure(typeof(ResultCodeApplication),
          ResultCodeApplication.FailedFormattingResponse),
          HttpUtility.GetTraceId(context),
          currentPath,
          (int)HttpStatusCode.BadRequest);
    }

    public override ProblemDetails CreateProblemDetails(HttpContext context,
        int? statusCode = null,
        string? title = null,
        string? type = null,
        string? detail = "A generic error has occurred on the server.",
        string? instance = null)
    {
        var status = statusCode ?? context.Response.StatusCode;

        // It feels weird to mutate the response inside this method, but it's the
        // only way to pass the status code to MapStatusCode and it will be set
        // on the response when writing the problem details response later anyway.
        context.Response.StatusCode = status;

        return AsyncHelper.RunSync(async () => await CreateProblemDetailsAsync(Result.Failure(typeof(ResultCodeGeneral),
            ResultCodeGeneral.GeneralError,
            detail,
            null,
            ResultSeverityTypes.Error),
          HttpUtility.GetTraceId(context),
          instance ?? context.Request.Path,
          status,
          type));
    }

       public ProblemDetailsResponse CreateProblemDetailsResponse(HttpContext context,
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
        return AsyncHelper.RunSync(async () => await CreateProblemDetailsAsync(Result.Failure(typeof(ResultCodeValidation),
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
    }

    public ProblemDetailsResponse CreateProblemDetailsResponse(HttpContext context,
        IList<FieldValidationResult> fields,
        int? statusCode = (int)HttpStatusCode.UnprocessableEntity,
        string? title = null,
        string? type = null,
        string? detail = "The request has failed a server-side validation.",
        string? instance = null)
    {
        return AsyncHelper.RunSync(async () => await CreateProblemDetailsAsync(Result.Failure(typeof(ResultCodeValidation),
            ResultCodeValidation.OneOrMoreValidationFailuresHaveOccurred,
            detail,
            null,
            ResultSeverityTypes.Error,
            null,
            fields),
          HttpUtility.GetTraceId(context),
          instance ?? context.Request.Path,
          statusCode ?? context.Response.StatusCode,
          type));
    }

    public ObjectResult GetObjectResult(HttpContext context,
        ProblemDetailsResponse problemDetails)
    {
      var problemDetailsResponse = new ProblemDetailsResponse();

      problemDetailsResponse = EnrichProblemDetails(context,
        ref problemDetailsResponse);

      var objResult = new ObjectResult(problemDetails)
      {
          StatusCode = problemDetailsResponse.Status,
      };

      objResult.ContentTypes.Add(HttpContentTypeConstants.ProblemJson);
      objResult.ContentTypes.Add(HttpContentTypeConstants.ProblemXml);

      return objResult;
    }

    public ProblemDetails EnrichProblemDetails(HttpContext context,
      ref ProblemDetails problemDetails)
    {
      var problemDetailsResponse = new ProblemDetailsResponse();

      problemDetailsResponse = EnrichProblemDetails(context,
        ref problemDetailsResponse);

      problemDetailsResponse.CopyTo(problemDetails);
      return problemDetails;
    }

    public ProblemDetailsResponse EnrichProblemDetails(HttpContext context,
      ref ProblemDetailsResponse problemDetailsResponse)
    {
      if (string.IsNullOrEmpty(problemDetailsResponse.TraceId))
        problemDetailsResponse.TraceId = HttpUtility.GetTraceId(context);

      if (string.IsNullOrEmpty(problemDetailsResponse.Instance))
        problemDetailsResponse.Instance = context.Request.Path;

      if (problemDetailsResponse.Status == null ||
        !problemDetailsResponse.Status.IsSet())
        problemDetailsResponse.Status = context.Response.StatusCode;

      if (string.IsNullOrEmpty(problemDetailsResponse.Type))
        problemDetailsResponse.Type = HttpUtility.GetStatusCodeUrl(context.Response.StatusCode);

      if (string.IsNullOrEmpty(problemDetailsResponse.Title))
        problemDetailsResponse.Title = HttpUtility.GetStatusCodeTitle(context.Response.StatusCode);

      if (problemDetailsResponse.Severity == SeverityTypesOptions.None)
        problemDetailsResponse.Severity = !HttpUtility.IsSuccessStatusCode(context.Response.StatusCode)
          ? SeverityTypesOptions.Error
          : SeverityTypesOptions.Info;

      return problemDetailsResponse;
    }

    public async Task<ProblemDetailsResponse> CreateProblemDetailsAsync(HttpContext context,
      Result result)
    {
      return await CreateProblemDetailsAsync(result,
        HttpUtility.GetTraceId(context),
        context.Request.Path,
        context.Response.StatusCode);
    }

    public async Task<ProblemDetailsResponse> CreateProblemDetailsAsync(Result result,
      string traceId,
      string currentPath,
      int statusCode,
      string? type = null)
    {
      var response = (ProblemDetailsResponse)await CreateBaseProblemDetailsAsync<ProblemDetailsResponse>(result,
        new ProblemDetailsResponse {
          TraceId = traceId,
          Type = !string.IsNullOrEmpty(type)
            ? type
            : !string.IsNullOrEmpty(result.HelpLink)
            ? result.HelpLink
            : HttpUtility.GetStatusCodeUrl(statusCode),
          Instance = !string.IsNullOrEmpty(currentPath)
            ? currentPath
            : "/",
          Status = statusCode,
      });
      if (result.Fields != null &&
        result.Fields.Count > 0)
          await result.Fields.ForEachAsync(async field => {
            var responseField = await CreateProblemDetailsFieldAsync(field);
            if (response.Errors.ContainsKey(responseField.Name))
              response.Errors[responseField.Name] = responseField;
            else
              response.Errors.Add(responseField.Name,
                responseField);
          });

      return response;
    }

    public async Task<ProblemDetailsFieldResponse> CreateProblemDetailsFieldAsync(FieldValidationResult result) =>
       (ProblemDetailsFieldResponse)await CreateBaseProblemDetailsAsync<ProblemDetailsFieldResponse>(result,
        new ProblemDetailsFieldResponse {
          Name = result.FieldName,
          AttemptedValue = result.AttemptedValue,
        });

    public async Task<BaseProblemDetailsResponse> CreateBaseProblemDetailsAsync<TResponse>(BaseResult result,
      TResponse response)
      where TResponse : BaseProblemDetailsResponse
    {
        response.ResultCode = result.Code;
        response.ResultType = result.Type;
        response.ExtendedDetail = result.ExtendedDetail;

      if (Enum.TryParse(typeof(BaseProblemDetailsResponse.SeverityTypesOptions),
        result.Severity.ToString(),
        false,
        out object? severity))
        severity = result.Failed
          ? BaseProblemDetailsResponse.SeverityTypesOptions.Error
          : BaseProblemDetailsResponse.SeverityTypesOptions.Info;
      if (severity != null)
        response.Severity = (BaseProblemDetailsResponse.SeverityTypesOptions)severity;

      return await Task.FromResult(response);
    }

    public ValueTask WriteAsync(ProblemDetailsContext context)
    {
      //context.AdditionalMetadata.
      throw new NotImplementedException();
    }
  }
}

