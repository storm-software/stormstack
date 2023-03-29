using System;
using System.Net;
using EventStore.ClientAPI;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Application.Utilities;
using OpenSystem.Core.Domain.Settings;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Infrastructure.EventStore.Repositories;
using Serilog;

namespace OpenSystem.Core.Infrastructure.EventStore.Extensions
{
    public static class EventSourcingSettingsExtensions
    {
        public static EventSourcingSettingsManager UseEventStoreEventStore(
            this EventSourcingSettingsManager eventSourcingSettings
        )
        {
            return (EventSourcingSettingsManager)
                eventSourcingSettings.UseEventPersistence<EventStoreEventPersistence>();
        }

        public static EventSourcingSettingsManager UseEventStoreEventStore(
            this EventSourcingSettingsManager eventSourcingSettings,
            ConnectionStringSettings settings,
            string connectionNamePrefix = "OpenSystem"
        )
        {
            var sanitizedConnectionNamePrefix = string.IsNullOrEmpty(connectionNamePrefix)
                ? string.Empty
                : connectionNamePrefix + " - ";

            var eventStoreConnection = EventStoreConnection.Create(
                settings.EventStoreConnection,
                ConnectionSettings.Create().KeepReconnecting(),
                $"{sanitizedConnectionNamePrefix}Connection v{typeof(EventSourcingSettingsExtensions).Assembly.GetName().Version}"
            );
            eventStoreConnection.Connected += (sender, args) =>
                Log.Information(
                    "Connection '{ConnectionName}' to {RemoteEndPoint} event store established.",
                    args.Connection.ConnectionName,
                    args.RemoteEndPoint
                );
            eventStoreConnection.Reconnecting += (sender, args) =>
                Log.Information(
                    "Re-establishing connection '{ConnectionName}' to event store.",
                    args.Connection.ConnectionName
                );
            eventStoreConnection.Disconnected += (sender, args) =>
                Log.Warning(
                    "Connection '{ConnectionName}' to {RemoteEndPoint} event store lost.",
                    args.Connection.ConnectionName,
                    args.RemoteEndPoint
                );
            eventStoreConnection.ErrorOccurred += (sender, args) =>
                Log.Error(
                    "Error occurred on event store '{ConnectionName}'. \r\nException: {Exception}",
                    args.Connection.ConnectionName,
                    args.Exception.ToString()
                );

            Task.Run(async () =>
                {
                    await eventStoreConnection.ConnectAsync().ConfigureAwait(false);
                })
                .Wait();

            return (EventSourcingSettingsManager)
                eventSourcingSettings
                    .RegisterServices(
                        f =>
                            f.Add(
                                new ServiceDescriptor(
                                    typeof(IEventStoreConnection),
                                    eventStoreConnection
                                )
                            )
                    )
                    .UseEventPersistence<EventStoreEventPersistence>();
        }
    }
}
