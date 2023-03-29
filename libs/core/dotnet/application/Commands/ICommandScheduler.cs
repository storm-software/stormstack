namespace OpenSystem.Core.Application.Commands
{
    public interface ICommandScheduler
    {
        Task ScheduleAsync(
            ICommand command,
            DateTimeOffset runAt,
            CancellationToken cancellationToken
        );

        Task ScheduleAsync(ICommand command, TimeSpan delay, CancellationToken cancellationToken);
    }
}
