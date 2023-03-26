using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Settings;
using Quartz;

namespace OpenSystem.Core.Infrastructure.Services
{
    public abstract class ScheduledService : BackgroundService
    {
        public ScheduledServiceSettings Settings { get; }

        public ILogger<ScheduledService> Logger { get; }

        /// <summary>
        /// A Cron expression to create firing schedules such as: "At 8:00am every Monday through Friday" or "At 1:30am every last Friday of the month".
        /// </summary>
        /// <remarks>For more info, please see: http://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/crontrigger.html</remarks>
        private CronExpression? _cronExpression { get; set; }

        private int _timeoutMs { get; set; }

        public ScheduledService(IOptions<ScheduledServiceSettings> settings,
          ILogger<ScheduledService> logger)
        {
            Settings = settings.Value;
            Logger = logger;
        }

        public override async Task StartAsync(CancellationToken cancellationToken)
        {
            await base.StartAsync(cancellationToken);

            if (string.IsNullOrEmpty(Settings.Cron))
            {
              Logger.LogError("Cron setting is missing from ServiceSettings");
              throw new MissingSettingException("Cron");
            }

            _cronExpression = new CronExpression(Settings.Cron);
            _timeoutMs = Settings.TimeoutMs;

            var result = InnerStartAsync(cancellationToken);
        }

        protected abstract ValueTask InnerProcess(CancellationToken stoppingToken);

        /// <summary>
        /// Allow base class to add start up logic
        /// </summary>
        public virtual ValueTask InnerStartAsync(CancellationToken cancellationToken)
        {
          return ValueTask.CompletedTask;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            if (_cronExpression == null)
            {
              Logger.LogError("Cron setting is missing from ServiceSettings");
              throw new MissingSettingException("Cron");
            }

            var next = _cronExpression.GetNextValidTimeAfter(DateTimeOffset.Now);
            while (!stoppingToken.IsCancellationRequested)
            {
                if (DateTimeOffset.Now > next)
                {
                  try
                  {
                    await InnerProcess(stoppingToken);
                  }
                  catch (Exception e)
                  {
                    Logger.LogError(e.Message);
                    throw;
                  }

                  next = _cronExpression.GetNextValidTimeAfter(DateTimeOffset.Now);
                }

                await Task.Delay(_timeoutMs,
                  stoppingToken);
            }
        }
    }
}
