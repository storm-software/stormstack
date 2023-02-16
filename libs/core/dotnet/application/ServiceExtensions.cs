using OpenSystem.Core.Application.Behaviors;
using OpenSystem.Core.Application.Helpers;
using OpenSystem.Core.Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using AutoMapper;

namespace OpenSystem.Core.Application
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddApplicationLayer(this IServiceCollection services)
        {
            //services.AddAutoMapper(Assembly.GetExecutingAssembly());
            //services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            //services.AddMediatR(Assembly.GetExecutingAssembly());

            services.AddAutoMapper(Assembly.GetExecutingAssembly());
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            services.AddMediatR(Assembly.GetExecutingAssembly());

            services.AddTransient(typeof(IPipelineBehavior<,>),
              typeof(UnhandledExceptionBehavior<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>),
              typeof(PerformanceBehavior<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>),
              typeof(AuthorizationBehavior<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>),
              typeof(ValidationBehavior<,>));

            services.AddScoped<IModelHelper, ModelHelper>();

            //services.AddScoped<IDataShapeHelper<Position>, DataShapeHelper<Position>>();
            //services.AddScoped<IDataShapeHelper<Employee>, DataShapeHelper<Employee>>();

            //services.AddScoped<IMockData, MockData>();

            return services;
        }
    }
}
