using Microsoft.AspNetCore.Http;
using OpenSystem.Core.Application.Models.DTOs;
using OpenSystem.Core.Domain.ResultCodes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Net;

namespace OpenSystem.Core.Application.Services
{
  public interface IProblemDetailsResponseFactory
    : IProblemDetailsService
  {
    public Task<ProblemDetailsResponse?> CreateExceptionProblemDetailsAsync(HttpContext context,
      Exception error);

    public ProblemDetails CreateProblemDetails(HttpContext context,
        int? statusCode = null,
        string? title = null,
        string? type = null,
        string? detail = "A generic error has occurred on the server.",
        string? instance = null);

       public ProblemDetailsResponse CreateProblemDetailsResponse(HttpContext context,
        int? statusCode = (int)HttpStatusCode.InternalServerError,
        string? title = null,
        string? type = null,
        string? detail = "A generic error has occurred on the server.",
        string? instance = null);

    public ValidationProblemDetails CreateValidationProblemDetails(HttpContext context,
        ModelStateDictionary modelStateDictionary,
        int? statusCode = (int)HttpStatusCode.UnprocessableEntity,
        string? title = null,
        string? type = null,
        string? detail = "The request has failed a server-side validation.",
        string? instance = null);

    public ProblemDetailsResponse CreateProblemDetailsResponse(HttpContext context,
        IList<FieldValidationResult> fields,
        int? statusCode = (int)HttpStatusCode.UnprocessableEntity,
        string? title = null,
        string? type = null,
        string? detail = "The request has failed a server-side validation.",
        string? instance = null);

    public ObjectResult GetObjectResult(HttpContext context,
      ProblemDetailsResponse problemDetails);

    public ProblemDetails EnrichProblemDetails(HttpContext context,
      ref ProblemDetails problemDetails);

    public ProblemDetailsResponse EnrichProblemDetails(HttpContext context,
      ref ProblemDetailsResponse problemDetailsResponse);

    public Task<ProblemDetailsResponse> CreateProblemDetailsAsync(HttpContext context,
      Result result);

    public Task<ProblemDetailsResponse> CreateProblemDetailsAsync(Result result,
      string traceId,
      string currentPath,
      int statusCode,
      string? type = null);

    public Task<ProblemDetailsFieldResponse> CreateProblemDetailsFieldAsync(FieldValidationResult result);

    public Task<BaseProblemDetailsResponse> CreateBaseProblemDetailsAsync<TResponse>(BaseResult result,
      TResponse response)
      where TResponse : BaseProblemDetailsResponse;

    public ValueTask WriteAsync(ProblemDetailsContext context);
  }
}

