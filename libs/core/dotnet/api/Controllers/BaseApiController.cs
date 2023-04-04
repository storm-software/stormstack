using System;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Infrastructure.WebApi.Controllers
{
    [ApiController]
    public abstract class BaseApiController : ControllerBase
    {
        private ISender? _sender => HttpContext.RequestServices.GetService<ISender>();

        protected readonly HttpContext? Context;

        protected readonly ILogger<BaseApiController> Logger;

        protected readonly string BaseUrl;

        /// <summary>
        /// Constructor method for BaseApiController
        /// </summary>
        /// <remarks>Constructor method to generate an instance of a BaseApiController</remarks>
        public BaseApiController(ILogger<BaseApiController> logger, IHttpContextAccessor context)
        {
            if (context.HttpContext != null)
            {
                Context = context.HttpContext;
                BaseUrl = $"{Context.Request.Scheme}://{Context.Request.Host}";
            }
            else
            {
                BaseUrl = "http://localhost";
            }

            Logger = logger;
            Logger.LogInformation($"{Context?.Request.Host} is running");
        }

        /// <summary>
        /// An end point to return the current API status
        /// </summary>
        /// <remarks>Add new message record</remarks>
        /// <response code="200">Example response</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpGet]
        [Route("/status")]
        public async Task<IActionResult> Status()
        {

        }

        /// <summary>
        /// An end point to indicate if the current API is running
        /// </summary>
        /// <remarks>Add new message record</remarks>
        /// <response code="200">Example response</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="404">Not Found</response>
        /// <response code="500">Internal Server Error</response>
        /// <response code="503">Service Unavailable</response>
        [MapToApiVersion("1")]
        [HttpGet]
        [Route("/health-check")]
        public async Task<IActionResult> HealthCheck()
        {
            var message = $"{Context?.Request.Host} is running at full health";

            Logger.LogInformation(message);
            return Ok(message);
        }

        /// <summary>
        /// Send request to the mediator
        /// </summary>
        public async Task<TResponse> SendRequest<TResponse>(
            IRequest<TResponse> request,
            CancellationToken cancellationToken
        )
        {
            if (_sender == null)
            {
                Logger.LogError(
                    $"Could not inject the mediator service into the API Controller during request '{Context?.Request.Path}'."
                );
                var statusCodeResult = StatusCode(
                    StatusCodes.Status500InternalServerError,
                    Result.Failure(
                        typeof(ResultCodeApplication),
                        ResultCodeApplication.MissingMediator
                    )
                );
            }

            Logger.LogInformation($"Sending {Context?.Request.Path} request to mediator");

            return await _sender.Send<TResponse>(request, cancellationToken);
            /*if (ret.Failed)
              return ret;*/
        }

        /// <summary>
        /// Send request to the mediator
        /// </summary>
        public async ValueTask<IActionResult> SendRequestAsync<TResponse>(
            IRequest<Result<TResponse>> request,
            CancellationToken cancellationToken
        )
        {
            if (_sender == null)
            {
                Logger.LogError(
                    $"Could not inject the mediator service into the API Controller during request '{Context?.Request.Path}'."
                );
                var statusCodeResult = StatusCode(
                    StatusCodes.Status500InternalServerError,
                    Result.Failure(
                        typeof(ResultCodeApplication),
                        ResultCodeApplication.MissingMediator
                    )
                );
            }

            Logger.LogInformation(
                $"Sending {request.GetType().Name} ({Context?.Request.Path}) request to mediator"
            );

            var ret = await _sender.Send<Result<TResponse>>(request, cancellationToken);
            if (ret.Failed)
            {
                Logger.LogError(
                    $"Failure occurred during {request.GetType().Name} ({Context?.Request.Path}) mediator request"
                );
                return BadRequest(ret);
            }

            Logger.LogInformation(
                $"Completed {request.GetType().Name} ({Context?.Request.Path})  mediator request"
            );

            return Ok(ret.Data);
        }

        /// <summary>
        /// Send command request to the mediator
        /// </summary>
        /*protected async ValueTask<IActionResult> SendCommandAsync(IRequest<Result<IIndexed>> request,
          CancellationToken cancellationToken)
        {
          if (_sender == null)
          {
            Logger.LogError($"Could not inject the mediator service into the API Controller during request '{Context?.Request.Path}'.");
            var statusCodeResult = StatusCode(StatusCodes.Status500InternalServerError,
              Result.Failure(typeof(ResultCodeApplication),
              ResultCodeApplication.MissingMediator));
          }

          Logger.LogInformation($"Sending {request.GetType().Name} ({Context?.Request.Path}) request to mediator");

          var ret = await _sender.Send<Result<IIndexed>>(request,
            cancellationToken);
          if (ret.Failed)
          {
            Logger.LogError($"Failure occurred during {request.GetType().Name} ({Context?.Request.Path}) mediator request");
            return BadRequest(ret);
          }

          Logger.LogInformation($"Completed {request.GetType().Name} ({Context?.Request.Path})  mediator request");

          return Ok(ret.Data);
        }*/

        /// <summary>
        /// Send command request to the mediator
        /// </summary>
        protected async ValueTask<IActionResult> SendQueryAsync<TData>(
            IRequest<Result<TData>> request,
            CancellationToken cancellationToken
        )
        {
            if (_sender == null)
            {
                Logger.LogError(
                    $"Could not inject the mediator service into the API Controller during request '{Context?.Request.Path}'."
                );
                var statusCodeResult = StatusCode(
                    StatusCodes.Status500InternalServerError,
                    Result.Failure(
                        typeof(ResultCodeApplication),
                        ResultCodeApplication.MissingMediator
                    )
                );
            }

            Logger.LogInformation(
                $"Sending {request.GetType().Name} ({Context?.Request.Path}) request to mediator"
            );

            var ret = await _sender.Send<Result<TData>>(request, cancellationToken);
            if (ret.Failed)
            {
                Logger.LogError(
                    $"Failure occurred during {request.GetType().Name} ({Context?.Request.Path}) mediator request"
                );
                if (
                    string.Equals(
                        ret.Type,
                        typeof(ResultCodeApplication).FullName.ToString(),
                        StringComparison.CurrentCultureIgnoreCase
                    )
                    && ret.Code == ResultCodeApplication.NoResultsFound
                )
                    return NotFound(ret);

                return BadRequest(ret);
            }

            Logger.LogInformation(
                $"Completed {request.GetType().Name} ({Context?.Request.Path})  mediator request"
            );

            return Ok(ret.Data);
        }
    }
}
