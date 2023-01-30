using AutoMapper;
using MediatR;
using OpenSystem.Core.DotNet.Application.Models;
using OpenSystem.User.Application.Interfaces;
using OpenSystem.User.Domain.Entities;
using OpenSystem.User.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace OpenSystem.User.Application.Commands.CreateUser
{
    public partial class CreateUserCommand
      : IRequest<Response<Guid>>
    {
        public string UserId { get; set; }

        public string Name { get; set; }

        public UserTypes Type { get; set; }

        public UserStatusTypes Status { get; set; }

        public string? Description { get; set; }

        public string Email { get; set; }

        public string Culture { get; set; }
    }

    public class CreateUserCommandHandler
      : IRequestHandler<CreateUserCommand, Response<Guid>>
    {
        private readonly IUserRepository _userRepository;

        private readonly IMapper _mapper;

        public CreateUserCommandHandler(IUserRepository userRepository,
          IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<Response<Guid>> Handle(CreateUserCommand request,
          CancellationToken cancellationToken)
        {
            var user = _mapper.Map<UserEntity>(request);
            await _userRepository.AddAsync(user);

            return new Response<Guid>(user.Id);
        }
    }
}
