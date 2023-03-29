namespace OpenSystem.Core.Domain.Utilities
{
   public interface IJsonSerializer
    {
        string Serialize(object obj, bool indented = false);
        
        object Deserialize(string json, Type type);

        T Deserialize<T>(string json);
    }
}
