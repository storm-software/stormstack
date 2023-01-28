using System;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace OpenSystem.Core.DotNet.WebApi.Controllers
{
    [ApiController]
    public abstract class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator
          ??= HttpContext.RequestServices.GetService<IMediator>();

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
    }
}
