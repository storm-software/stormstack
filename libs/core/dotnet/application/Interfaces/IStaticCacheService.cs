using System.Collections;

namespace OpenSystem.Core.Application.Interfaces
{
  public interface ICacheService
  {
      /// <summary>
      /// Get static data using key
      /// </summary>
      /// <typeparam name="TData"></typeparam>
      /// <param name="key"></param>
      /// <returns></returns>
      IEnumerable<TData> Get<TData>(string key);

      /// <summary>
      /// Get all static data
      /// </summary>
      /// <typeparam name="TData"></typeparam>
      /// <param name="key"></param>
      /// <returns></returns>
      Dictionary<string, IEnumerable> Get();

      /// <summary>
      /// Get static data using multiple keys
      /// </summary>
      /// <param name="keys"></param>
      /// <returns></returns>
      Dictionary<string, IEnumerable> Get(string[] keys);
  }
}
