using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Text.Unicode;
using System.Threading.Tasks;

namespace OpenSystem.Core.Domain.Constants
{
  public class DefaultJsonSerializerOptions
  {
      public static  JsonSerializerOptions Options => new()
      {
          Encoder = JavaScriptEncoder.Create(UnicodeRanges.BasicLatin, UnicodeRanges.CjkUnifiedIdeographs),
          PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
          PropertyNameCaseInsensitive = true,
          Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) }
      };
  }
}




