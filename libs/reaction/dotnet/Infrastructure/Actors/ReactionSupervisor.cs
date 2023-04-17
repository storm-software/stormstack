/*using System.Collections.Generic;
using System.Linq;
using Akka.Actor;
using Akka.Persistence;
using Akka.Persistence.Query;
using Akka.Streams;
using Akka.Streams.Dsl;
using Akka.Persistence.Query.Sql;

namespace OpenSystem.Reaction.Infrastructure.Actors
{
    public class ReactionSupervisor<TKey, TValue> : ReceiveActor
    {
        private static readonly AtomicCounter WorkerId = new AtomicCounter();

        public static Props Props(
            ConsumerSettings<TKey, TValue> settings,
            ISubscription subscription,
            int partitions
        ) =>
            settings.Akka.Actor.Props.Create(
                () => new ReactionSupervisor<TKey, TValue>(settings, subscription, partitions)
            );

        private readonly ConsumerSettings<TKey, TValue> _settings;
        private readonly ISubscription _subscription;
        private readonly int _partitions;

        public static Props Props(IMessageExtractor extractor, Func<string, Props> propsFactory)
        {
            ExtractEntityId realExtractor = message =>
                (extractor.EntityId(message), extractor.EntityMessage(message));

            return Create(() => new GenericChildPerEntityParent(realExtractor, propsFactory));
        }

        private ExtractEntityId _extractor;

        private Func<string, Props> _propsFactory;

        public GenericChildPerEntityParent(
            ExtractEntityId extractor,
            Func<string, Props> propsFactory
        )
        {
            _extractor = extractor;
            _propsFactory = propsFactory;

            ReceiveAny(o =>
            {
                var result = extractor(o);
                if (!result.HasValue)
                    return;
                var (id, msg) = result.Value;
                Context
                    .Child(id)
                    .GetOrElse(() => Context.ActorOf(propsFactory(id), id))
                    .Forward(msg);
            });
        }

        public ReactionQueryHandlerSupervisor(
            ConsumerSettings<TKey, TValue> settings,
            ISubscription subscription,
            int partitions
        )
        {
            _settings = settings;
            _subscription = subscription;
            _partitions = partitions;
        }

        protected override SupervisorStrategy SupervisorStrategy() =>
            new OneForOneStrategy(ex =>
            {
                return ex switch
                {
                    Exception { Message: "BOOM!" } => Directive.Restart,
                    _ => Directive.Escalate
                };
            });

        protected override void PreStart()
        {
            base.PreStart();
            for (var i = 0; i < _partitions; i++)
            {
                var id = WorkerId.IncrementAndGet();
                Context.ActorOf(
                    ReactionQueryHandler<TKey, TValue>.Props(_settings, _subscription),
                    $"worker-{id}"
                );
            }
        }
    }
}
*/
