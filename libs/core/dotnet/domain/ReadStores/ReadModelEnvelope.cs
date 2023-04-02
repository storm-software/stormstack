using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.ReadStores
{
    public abstract class ReadModelEnvelope
    {
        protected ReadModelEnvelope(string readModelId, ulong? version)
        {
            if (string.IsNullOrEmpty(readModelId))
                throw new ArgumentNullException(nameof(readModelId));

            ReadModelId = readModelId;
            Version = version;
        }

        public string ReadModelId { get; }
        public ulong? Version { get; }
    }

    public class ReadModelEnvelope<TReadModel> : ReadModelEnvelope
        where TReadModel : class, IReadModel
    {
        private ReadModelEnvelope(string readModelId, TReadModel readModel, ulong? version)
            : base(readModelId, version)
        {
            ReadModel = readModel;
        }

        public TReadModel ReadModel { get; }

        public static ReadModelEnvelope<TReadModel> Empty(string readModelId)
        {
            return new ReadModelEnvelope<TReadModel>(readModelId, null, null);
        }

        public static ReadModelEnvelope<TReadModel> With(string readModelId, TReadModel readModel)
        {
            return new ReadModelEnvelope<TReadModel>(readModelId, readModel, null);
        }

        public static ReadModelEnvelope<TReadModel> With(
            string readModelId,
            TReadModel readModel,
            ulong? version
        )
        {
            return new ReadModelEnvelope<TReadModel>(readModelId, readModel, version);
        }

        public static ReadModelEnvelope<TReadModel> With(
            string readModelId,
            TReadModel readModel,
            ulong version
        )
        {
            return new ReadModelEnvelope<TReadModel>(readModelId, readModel, version);
        }

        public ReadModelUpdateResult<TReadModel> AsUnmodifiedResult<TReadModel>()
            where TReadModel : class, IReadModel
        {
            return new ReadModelUpdateResult<TReadModel>(
                ReadModelEnvelope<TReadModel>.With(ReadModelId, ReadModel as TReadModel, Version),
                false
            );
        }

        public ReadModelUpdateResult<TReadModel> AsModifiedResult<TReadModel>(
            TReadModel readModel,
            ulong? version = null
        )
            where TReadModel : class, IReadModel
        {
            return new ReadModelUpdateResult<TReadModel>(
                ReadModelEnvelope<TReadModel>.With(ReadModelId, readModel, version),
                true
            );
        }
    }
}
