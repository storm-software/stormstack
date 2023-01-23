using Microsoft.AspNetCore.Hosting;
using Ocelot.Provider.Consul;

namespace OpenSystem.Apis.Gateway
{
    public class Program
    {
        public static void Main(string[] args)
        {
          // Host builder
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
