using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Application.ReadStores
{
    public abstract class ReadModelEnvelope
    {
        protected ReadModelEnvelope(
            string readModelId,
            ulong? version = 0,
            bool? isModified = false
        )
        {
            if (string.IsNullOrEmpty(readModelId))
                throw new ArgumentNullException(nameof(readModelId));

            ReadModelId = readModelId;
            Version = version;
            IsModified = isModified == true;
        }

        public string ReadModelId { get; }

        public ulong? Version { get; }

        public bool IsModified { get; } = false;
    }

    public class ReadModelEnvelope<TReadModel> : ReadModelEnvelope
        where TReadModel : class, IReadModel
    {
        private ReadModelEnvelope(
            string readModelId,
            TReadModel readModel,
            ulong? version,
            bool? isModified = false
        )
            : base(readModelId, version, isModified)
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
            ulong? version,
            bool? isModified = false
        )
        {
            return new ReadModelEnvelope<TReadModel>(readModelId, readModel, version, isModified);
        }

        public static ReadModelEnvelope<TReadModel> With(
            string readModelId,
            TReadModel readModel,
            ulong version,
            bool? isModified = false
        )
        {
            return new ReadModelEnvelope<TReadModel>(readModelId, readModel, version, isModified);
        }

        public ReadModelEnvelope<TReadModel> AsUnmodified<TReadModel>()
            where TReadModel : class, IReadModel
        {
            return ReadModelEnvelope<TReadModel>.With(
                ReadModelId,
                ReadModel as TReadModel,
                Version,
                false
            );
        }

        public ReadModelEnvelope<TReadModel> AsModified<TReadModel>(
            TReadModel readModel,
            ulong? version = null
        )
            where TReadModel : class, IReadModel
        {
            return ReadModelEnvelope<TReadModel>.With(ReadModelId, readModel, version, true);
        }
    }
}
