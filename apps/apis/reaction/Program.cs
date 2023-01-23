using System;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using OpenSystem.Core.DotNet.Application;
using OpenSystem.Core.DotNet.Infrastructure.Persistence.Contexts;
using OpenSystem.Core.DotNet.Infrastructure.Extensions;
using OpenSystem.Core.DotNet.Infrastructure;
using OpenSystem.Core.DotNet.WebApi.Constants;
using OpenSystem.Core.DotNet.WebApi.Extensions;
using OpenSystem.Apis.Reaction.Extensions;

const string SERVICE_NAME = "ReactionService.Api";

try
{
    var builder = WebApplication.CreateBuilder(args);

    // load up serilog configuration
    Log.Logger = new LoggerConfiguration()
      .ReadFrom.Configuration(builder.Configuration)
      .Enrich.FromLogContext()
      .CreateLogger();
    builder.Host.UseSerilog(Log.Logger);

    builder.Services.AddServiceDiscovery(builder.Configuration);

    builder.Services.AddApplicationLayer();
    builder.Services.AddPersistenceInfrastructure(builder.Configuration);
    builder.Services.AddServiceInfrastructure(builder.Configuration);

    builder.Services.AddSwaggerExtension();

    builder.Services.AddControllersExtension();

    // CORS
    builder.Services.AddCorsExtension();
    builder.Services.AddHealthChecks();

    //API Security
    builder.Services.AddJWTAuthentication(builder.Configuration);
    builder.Services.AddAuthorizationPolicies(builder.Configuration);

    // API version
    builder.Services.AddApiVersioningExtension();

    // API explorer
    builder.Services.AddMvcCore()
        .AddApiExplorer();

    // API explorer version
    builder.Services.AddVersionedApiExplorerExtension();
    var app = builder.Build();
    if (app.Environment.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }
    else
    {
        app.UseExceptionHandler("/Error");
        app.UseHsts();
    }

    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        // use context
        dbContext.Database.EnsureCreated();
    }

    // Add this line; you'll need `using Serilog;` up the top, too
    app.UseSerilogRequestLogging();
    app.UseServiceDiscovery(app.Lifetime);
    app.UseHttpsRedirection();
    app.UseRouting();

    //Enable CORS
    app.UseCors("AllowAll");
    app.UseAuthentication();
    app.UseAuthorization();
    app.UseSwaggerExtension();
    app.UseErrorHandlingMiddleware();
    app.UseHealthChecks("/health-check");
    app.MapControllers();
    app.Run();

    Log.Information($"{SERVICE_NAME} has started successfully.");
}
catch (Exception ex)
{
    Log.Error(ex,
      $"An error occurred starting {SERVICE_NAME}");
}
finally
{
    Log.CloseAndFlush();
}