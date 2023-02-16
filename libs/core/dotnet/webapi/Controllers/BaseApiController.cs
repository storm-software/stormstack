using System;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;

namespace OpenSystem.Core.WebApi.Controllers
{
    [ApiController]
    public abstract class BaseApiController : ControllerBase
    {
        private IMediator? _mediator => HttpContext.RequestServices.GetService<IMediator>();

        protected readonly HttpContext Context;

        protected readonly ILogger<BaseApiController> Logger;

        protected readonly string BaseUrl;

        /// <summary>
        /// Constructor method for BaseApiController
        /// </summary>
        /// <remarks>Constructor method to generate an instance of a BaseApiController</remarks>
        public BaseApiController(ILogger<BaseApiController> logger,
            IHttpContextAccessor context)
        {
          if (context.HttpContext != null)
          {
            Context = context.HttpContext;
            BaseUrl = $"{Context.Request.Scheme}://{Context.Request.Host}";
          }

          Logger = logger;
        }

        /// <summary>
        /// An end point to indicate if the current API is running
        /// </summary>
        [HttpGet]
        [Route("/health-check")]
        public async Task<IActionResult> HealthCheck()
        {
          var status = $"{Context.Request.Host} is running at full health";

          Logger.LogInformation(status);
          return Ok(status);
        }

        /// <summary>
        /// Send request to the mediator
        /// </summary>
        public async Task<TResponse> SendRequest<TResponse>(IRequest<TResponse> request)
        {
          if (_mediator == null)
          {
            throw new GeneralProcessingException(typeof(ResultCodeApplication),
              ResultCodeApplication.MissingMediator);
          }

          Logger.LogInformation($"Sending {Context.Request.Path} request to mediator");

          return await _mediator.Send<TResponse>(request);
        }

    }
}
