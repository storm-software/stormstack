using System;
using System.Reflection;
using System.Threading.Tasks;
using Nito.AsyncEx;

namespace OpenSystem.Core.Domain.Utilities
{
  /// <summary>
  /// Provides some helper methods to work with async methods.
  /// </summary>
  public static class AsyncHelper
  {
      /// <summary>
      /// Checks if given method is an async method.
      /// </summary>
      /// <param name="method">A method to check</param>
      public static bool IsAsync(this MethodInfo method)
      {
          return method != null && method.ReturnType.IsTaskOrTaskOfT();
      }

      public static bool IsTaskOrTaskOfT(this Type type)
      {
          return type == typeof(Task) ||
            (type.GetTypeInfo().IsGenericType &&
              type.GetGenericTypeDefinition() == typeof(Task<>));
      }

      public static bool IsTaskOfT(this Type type)
      {
          return type.GetTypeInfo().IsGenericType &&
            type.GetGenericTypeDefinition() == typeof(Task<>);
      }

      /// <summary>
      /// Returns void if given type is Task.
      /// Return T, if given type is Task{T}.
      /// Returns given type otherwise.
      /// </summary>
      public static Type UnwrapTask(Type type)
      {
          if (type != null)
          {
            if (type == typeof(Task))
            {
                return typeof(void);
            }

            if (type.IsTaskOfT())
            {
                return type.GenericTypeArguments[0];
            }
          }

          return type;
      }

      /// <summary>
      /// Runs a async method synchronously.
      /// </summary>
      /// <param name="func">A function that returns a result</param>
      /// <typeparam name="TResult">Result type</typeparam>
      /// <returns>Result of the async operation</returns>
      public static TResult RunSync<TResult>(Func<Task<TResult>> func)
      {
          return AsyncContext.Run(func);
      }

      /// <summary>
      /// Runs a async method synchronously.
      /// </summary>
      /// <param name="action">An async action</param>
      public static void RunSync(Func<Task> action)
      {
          AsyncContext.Run(action);
      }

      public static async Task AwaitTaskWithFinally(Task actualReturnValue, Action<Exception> finalAction)
    {
        Exception exception = null;

        try
        {
            await actualReturnValue;
        }
        catch (Exception ex)
        {
            exception = ex;
            throw;
        }
        finally
        {
            finalAction(exception);
        }
    }

    public static async Task AwaitTaskWithPostActionAndFinally(Task actualReturnValue, Func<Task> postAction, Action<Exception> finalAction)
    {
        Exception exception = null;

        try
        {
            await actualReturnValue;
            await postAction();
        }
        catch (Exception ex)
        {
            exception = ex;
            throw;
        }
        finally
        {
            finalAction(exception);
        }
    }

    public static async Task AwaitTaskWithPreActionAndPostActionAndFinally(Func<Task> actualReturnValue,
      Func<Task> preAction = null,
      Func<Task> postAction = null,
      Action<Exception> finalAction = null)
    {
        Exception exception = null;

        try
        {
            if (preAction != null)
            {
                await preAction();
            }

            await actualReturnValue();

            if (postAction != null)
            {
                await postAction();
            }
        }
        catch (Exception ex)
        {
            exception = ex;
            throw;
        }
        finally
        {
            if (finalAction != null)
            {
                finalAction(exception);
            }
        }
    }

    public static async Task<T> AwaitTaskWithFinallyAndGetResult<T>(Task<T> actualReturnValue,
      Action<Exception> finalAction)
    {
        Exception exception = null;

        try
        {
            return await actualReturnValue;
        }
        catch (Exception ex)
        {
            exception = ex;
            throw;
        }
        finally
        {
            finalAction(exception);
        }
    }

    public static object CallAwaitTaskWithFinallyAndGetResult(Type taskReturnType,
      object actualReturnValue,
      Action<Exception> finalAction)
    {
        return typeof(AsyncHelper)
            .GetTypeInfo()
            .GetMethod("AwaitTaskWithFinallyAndGetResult", BindingFlags.Public | BindingFlags.Static)
            .MakeGenericMethod(taskReturnType)
            .Invoke(null,
              new object[] { actualReturnValue, finalAction });
    }

    public static async Task<T> AwaitTaskWithPostActionAndFinallyAndGetResult<T>(Task<T> actualReturnValue,
      Func<Task> postAction,
      Action<Exception> finalAction)
    {
        Exception exception = null;

        try
        {
            var result = await actualReturnValue;
            await postAction();
            return result;
        }
        catch (Exception ex)
        {
            exception = ex;
            throw;
        }
        finally
        {
            finalAction(exception);
        }
    }

    public static object CallAwaitTaskWithPostActionAndFinallyAndGetResult(Type taskReturnType,
      object actualReturnValue,
      Func<Task> action,
      Action<Exception> finalAction)
    {
        return typeof(AsyncHelper)
            .GetTypeInfo()
            .GetMethod("AwaitTaskWithPostActionAndFinallyAndGetResult",
              BindingFlags.Public | BindingFlags.Static)
            .MakeGenericMethod(taskReturnType)
            .Invoke(null,
              new object[] {
                actualReturnValue,
                action,
                finalAction
              });
    }

    public static async Task<T> AwaitTaskWithPreActionAndPostActionAndFinallyAndGetResult<T>(Func<Task<T>> actualReturnValue,
      Func<Task> preAction = null,
      Func<Task> postAction = null,
      Action<Exception> finalAction = null)
    {
        Exception exception = null;

        try
        {
            if (preAction != null)
            {
                await preAction();
            }

            var result = await actualReturnValue();

            if (postAction != null)
            {
                await postAction();
            }

            return result;
        }
        catch (Exception ex)
        {
            exception = ex;
            throw;
        }
        finally
        {
            finalAction?.Invoke(exception);
        }
    }

    public static object CallAwaitTaskWithPreActionAndPostActionAndFinallyAndGetResult(Type taskReturnType,
      Func<object> actualReturnValue,
      Func<Task> preAction = null,
      Func<Task> postAction = null,
      Action<Exception> finalAction = null)
    {
        var returnFunc = typeof(AsyncHelper)
            .GetTypeInfo()
            .GetMethod("ConvertFuncOfObjectToFuncOfTask", BindingFlags.NonPublic | BindingFlags.Static)
            .MakeGenericMethod(taskReturnType)
            .Invoke(null,
              new object[] { actualReturnValue });

        return typeof(AsyncHelper)
            .GetTypeInfo()
            .GetMethod("AwaitTaskWithPreActionAndPostActionAndFinallyAndGetResult",
            BindingFlags.Public | BindingFlags.Static)
            .MakeGenericMethod(taskReturnType)
            .Invoke(null,
              new object[] {
                returnFunc,
                preAction,
                postAction,
                finalAction
              });
    }

    private static Func<Task<T>> ConvertFuncOfObjectToFuncOfTask<T>(Func<object> actualReturnValue)
    {
        return () => (Task<T>)actualReturnValue();
    }
  }
}
