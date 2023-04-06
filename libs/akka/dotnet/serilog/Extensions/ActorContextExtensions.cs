using Akka.Actor;
using Akka.Event;
using Akka.Logger.Serilog;

namespace OpenSystem.Akka.Serilog.Extensions
{
    public static class ActorContextExtensions
    {
        public static ILoggingAdapter GetSerilogLogger(this IUntypedActorContext context)
        {
            return context.GetLogger<SerilogLoggingAdapter>();
        }
    }
}
