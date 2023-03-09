namespace OpenSystem.Core.Domain.Settings
{
  public class ScheduledServiceSettings
  {
    /// <summary>
    /// A Cron expression to create firing schedules such as: "At 8:00am every Monday through Friday" or "At 1:30am every last Friday of the month".
    /// </summary>
    /// <remarks>For more info, please see: http://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/crontrigger.html</remarks>
    public string Cron { get; set; }

    /// <summary>
    /// Time to pause between processing (default 1000ms)
    /// </summary>
    public int TimeoutMs { get; set; } = 1000;
  }
}
