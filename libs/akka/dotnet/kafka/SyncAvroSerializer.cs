using Confluent.Kafka;
using Confluent.SchemaRegistry;
using Confluent.SchemaRegistry.Serdes;

namespace OpenSystem.Akka.Kafka
{
    public class SyncAvroSerializer<T> : AvroSerializer<T>, ISerializer<T>
    {
        public SyncAvroSerializer(
            ISchemaRegistryClient schemaRegistry,
            AvroSerializerConfig? config = null
        )
            : base(schemaRegistry, config) { }

        /// <summary>
        ///     Serialize the key or value of a <see cref="Message{TKey,TValue}" />
        ///     instance.
        /// </summary>
        /// <param name="data">
        ///     The value to serialize.
        /// </param>
        /// <param name="context">
        ///     Context relevant to the serialize operation.
        /// </param>
        /// <returns>
        ///     The serialized value.
        /// </returns>
        public byte[] Serialize(T data, SerializationContext context)
        {
            Console.WriteLine("Serializing message: " + data?.ToString());

            try
            {
                return base.SerializeAsync(data, context).GetAwaiter().GetResult();
            }
            catch (Exception e)
            {
                Console.WriteLine("Error occured serializing message " + data?.ToString());
                Console.WriteLine(e);
                throw;
            }
        }
    }
}
