using System;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using Serilog;

namespace OpenSystem.Core.WebApi.Controllers
{
    [ApiController]
    public abstract class BaseApiController : ControllerBase
    {
        private IMediator? _mediator => HttpContext.RequestServices.GetService<IMediator>();

        protected readonly HttpContext? Context;

        protected readonly ILogger Logger;

        protected readonly string BaseUrl;

        /// <summary>
        /// Constructor method for BaseApiController
        /// </summary>
        /// <remarks>Constructor method to generate an instance of a BaseApiController</remarks>
        public BaseApiController(ILogger logger,
            IHttpContextAccessor context)
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
          Logger.Information($"{Context?.Request.Host} is running");
        }

        /// <summary>
        /// An end point to indicate if the current API is running
        /// </summary>
        [HttpGet]
        [Route("/health-check")]
        public async Task<IActionResult> HealthCheck()
        {
          var status = $"{Context?.Request.Host} is running at full health";

          Logger.Information(status);
          return Ok(status);
        }

        /// <summary>
        /// Send request to the mediator
        /// </summary>
        public async Task<TResponse> SendRequest<TResponse>(IRequest<TResponse> request,
          CancellationToken cancellationToken)
        {
          if (_mediator == null)
          {
            throw new GeneralProcessingException(typeof(ResultCodeApplication),
              ResultCodeApplication.MissingMediator);
          }

          Logger.Information($"Sending {Context?.Request.Path} request to mediator");

          return await _mediator.Send<TResponse>(request,
            cancellationToken);
          /*if (ret.Failed)
            return ret;*/
        }

        /// <summary>
        /// Send request to the mediator
        /// </summary>
        public async ValueTask<IActionResult> SendRequestResult<TResponse>(IRequest<Result<TResponse>> request,
          CancellationToken cancellationToken)
        {
          if (_mediator == null)
          {
            throw new GeneralProcessingException(typeof(ResultCodeApplication),
              ResultCodeApplication.MissingMediator);
          }

          Logger.Information($"Sending {Context?.Request.Path} request to mediator");

          var ret = await _mediator.Send<Result<TResponse>>(request,
            cancellationToken);
          if (ret.Failed)
            return BadRequest(ret);

          return Ok(ret.Data);
        }
    }
}
