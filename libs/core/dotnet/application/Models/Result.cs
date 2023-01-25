using System.Collections.Generic;
using System.Runtime.Serialization;
using OpenSystem.Core.DotNet.Application.Models.Parameters;

namespace OpenSystem.Core.DotNet.Application.Models
{
    [Serializable]
    public class Result<T> : ISerializable
    {
        public bool Succeeded { get; set; }

        public bool Failed => !Succeeded;

        public string? Message { get; set; }

        public ErrorDetails? Errors { get; set; }

        public T? Data { get; set; }

        public Result()
        {
        }

        public Result(T data,
          string? message = null)
        {
            Succeeded = true;
            Message = message;
            Data = data;
        }

        public Result(string message)
        {
            Succeeded = false;
            Message = message;
        }

      public void GetObjectData(SerializationInfo info,
        StreamingContext context)
      {
          info.AddValue("Failed", Failed);
          info.AddValue("Succeeded", Succeeded);
          info.AddValue("Message", Message);
          if (Failed)
            info.AddValue("Errors", Errors);
          if (Data != null)
            info.AddValue("Data", Data);
      }
  }
}
