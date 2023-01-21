
using Microsoft.AspNetCore.Builder;

namespace OpenSystem.Apis.Engagement.Extensions
{
    public static class AppExtensions
    {
        public static void UseSwaggerExtension(this IApplicationBuilder app)
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json",
                  "OpenSystem.Apis.Engagement");
            });
        }
    }
}
