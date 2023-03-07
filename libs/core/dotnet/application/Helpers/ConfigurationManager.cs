using Microsoft.Extensions.Configuration;
using System.IO;

namespace OpenSystem.Core.Application.Helpers
{
    /// <summary>
    /// Custom string to enum converter
    /// </summary>
    static class ConfigurationManager {
        public static IConfiguration AppSetting {
            get;
        }

        static ConfigurationManager() {
            AppSetting = new ConfigurationBuilder()
              .SetBasePath(Directory.GetCurrentDirectory())
              .AddJsonFile("appsettings.json")
              .Build();
        }
    }
}
