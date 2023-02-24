using System;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using OpenSystem.Reaction.Application;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Infrastructure.Persistence;
using OpenSystem.Core.Infrastructure.Extensions;
using OpenSystem.Core.Infrastructure;
using OpenSystem.Reaction.Infrastructure;
using OpenSystem.Core.WebApi.Constants;
using OpenSystem.Core.WebApi.Extensions;
using OpenSystem.Core.WebApi.Services;
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

    // builder.Services.AddServiceDiscovery(builder.Configuration);

    builder.Services.AddReactionApplicationLayer();
    builder.Services.AddReactionPersistenceInfrastructure(builder.Configuration);
    builder.Services.AddReactionServiceInfrastructure(builder.Configuration);

    builder.Services.AddSwaggerExtension();

    builder.Services.AddControllersExtension();

    // CORS
    builder.Services.AddCorsExtension();
    builder.Services.AddHealthChecks();

    builder.Services.AddDatabaseDeveloperPageExceptionFilter();
    builder.Services.AddSingleton<ICurrentUserService,
      CurrentUserService>();
    builder.Services.AddHttpContextAccessor();

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
        // app.UseMigrationsEndPoint();
    }
    else
    {
        app.UseExceptionHandler("/error");

        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }

    /*using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        // use context
        dbContext.Database.EnsureCreated();
    }*/

    // Add this line; you'll need `using Serilog;` up the top, too
    app.UseSerilogRequestLogging();
    // app.UseHttpsRedirection();
    app.UseStaticFiles();
    app.UseRouting();

    //Enable CORS
    app.UseCors(builder =>
    {
      builder.WithOrigins(new string[] { "http://localhost:3000",
        "http://localhost:3002" })
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });

    app.UseIdentityServer();
    app.UseAuthorization();

    app.UseSwaggerExtension();
    app.UseCoreMiddleware();
    app.UseHealthChecks("/health-check");
    app.MapControllers();

    app.Run();

    Log.Information($"{SERVICE_NAME} has started successfully.");

}
catch (Exception ex)
{
    Log.Warning(ex,
      $"An error occurred starting {SERVICE_NAME}");
}
finally
{
    Log.CloseAndFlush();
}
