namespace OpenSystem.Core.Domain.Extensions
{
  public static class EnumerableExtensions
  {
    /// <summary>
    /// Wraps this object instance into an IEnumerable&lt;T&gt;
    /// consisting of a single item.
    /// </summary>
    /// <typeparam name="T"> Type of the object. </typeparam>
    /// <param name="item"> The instance that will be wrapped. </param>
    /// <returns> An IEnumerable&lt;T&gt; consisting of a single item. </returns>
    public static IEnumerable<T> Yield<T>(this T item)
    {
        yield return item;
    }

    public static async Task ForEachAsync<T>(this IEnumerable<T> enumerable, Func<T, Task> action)
    {
        await Parallel.ForEachAsync(
            enumerable,
            async (item, _) => await action(item));
    }
  }
}
