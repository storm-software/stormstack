using OpenSystem.User.Application.Queries.GetUsers;
using OpenSystem.User.Application.Commands.CreateUser;
using OpenSystem.User.Domain.Entities;
using AutoMapper;
using OpenSystem.Core.DotNet.Application.Mappings;

namespace OpenSystem.User.Application.Mappings
{
    public class UserMappingProfile : MappingProfile
    {
        public UserMappingProfile()
        {
            CreateMap<UserEntity, GetUsersViewModel>().ReverseMap();
            CreateMap<CreateUserCommand, UserEntity>();
        }
    }
}



