using Microsoft.AspNetCore.Http;
using OpenSystem.Core.Application.Models.DTOs;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Core.Application.Interfaces
{
  public interface IProblemDetailsResponseFactory
  {
    public Task<ProblemDetailsResponse> CreateAsync(HttpContext context,
      Exception error);
      
    public Task<ProblemDetailsResponse> CreateAsync(HttpContext context,
      Result result);

    public Task<ProblemDetailsResponse> CreateAsync(HttpContext context,
      string resultType,
      int resultCode,
      string? extendedDetail = null,
      int? statusCode = null,
      string? instance = null,
      string? helpLink = null,
      string? traceId = null,
      string? stackTrace = null,
      ResultSeverityTypes? severity = null,
      IList<FieldValidationResult>? errors = null);

    public Task<ProblemDetailsResponse> CreateAsync(string resultType,
      int resultCode,
      int statusCode,
      string? extendedDetail,
      string instance,
      string helpLink,
      string traceId,
      string? stackTrace = null,
      ResultSeverityTypes? severity = null,
      IList<FieldValidationResult>? errors = null);

    public Task<ProblemDetailsFieldResponse> CreateFieldAsync(string name,
      object? attemptedValue,
      string resultType,
      int resultCode,
      string instance,
      string? detail,
      string? extendedDetail = null,
      ResultSeverityTypes? severity = null);
  }
}

