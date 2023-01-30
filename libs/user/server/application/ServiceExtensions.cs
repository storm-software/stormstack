using OpenSystem.Core.DotNet.Application.Behaviors;
using OpenSystem.Core.DotNet.Application.Helpers;
using OpenSystem.Core.DotNet.Application.Interfaces;
using OpenSystem.Core.DotNet.Application;
using OpenSystem.User.Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using AutoMapper;

namespace OpenSystem.User.Application
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddUserApplicationLayer(this IServiceCollection services)
        {
            services.AddAutoMapper(Assembly.GetExecutingAssembly());
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            services.AddMediatR(Assembly.GetExecutingAssembly());

            services.AddApplicationLayer();

            services.AddScoped<IDataShapeHelper<UserEntity>,
              DataShapeHelper<UserEntity>>();

            return services;
        }
    }
}
