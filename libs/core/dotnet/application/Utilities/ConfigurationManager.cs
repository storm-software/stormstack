using Microsoft.Extensions.Configuration;
using System.IO;

namespace OpenSystem.Core.Application.Utilities
{
    /// <summary>
    /// Custom string to enum converter
    /// </summary>
    public static class ConfigurationManager
    {
        public static IConfiguration AppSetting { get; }

        static ConfigurationManager()
        {
            AppSetting = new ConfigurationBuilder()
              .SetBasePath(Directory.GetCurrentDirectory())
              .AddJsonFile("appsettings.json")
              .Build();
        }
    }
}
