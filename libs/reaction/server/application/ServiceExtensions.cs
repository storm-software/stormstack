using OpenSystem.Core.Application;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using AutoMapper;

namespace OpenSystem.Reaction.Application
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddReactionApplicationLayer(
            this IServiceCollection services
        )
        {
            services.AddAutoMapper(Assembly.GetExecutingAssembly());
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            services.AddMediatR(Assembly.GetExecutingAssembly());

            services.AddApplicationLayer();

            return services;
        }
    }
}
