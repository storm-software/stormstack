using MediatR;
using OpenSystem.Core.DotNet.Application.Exceptions;
using OpenSystem.Core.DotNet.Application.Models;
using OpenSystem.Core.DotNet.Domain.ResultCodes;
using OpenSystem.User.Application.Interfaces;
using OpenSystem.User.Domain.Entities;

namespace OpenSystem.User.Application.Queries.GetUserById
{
    public class GetUserByIdQuery : IRequest<Response<UserEntity>>
    {
        public Guid Id { get; set; }

        public class GetUserByIdQueryHandler
          : IRequestHandler<GetUserByIdQuery, Response<UserEntity>>
        {
            private readonly IUserRepository _userRepository;

            public GetUserByIdQueryHandler(IUserRepository userRepository)
            {
                _userRepository = userRepository;
            }

            public async Task<Response<UserEntity>> Handle(GetUserByIdQuery query,
              CancellationToken cancellationToken)
            {
                var user = await _userRepository.GetByIdAsync(query.Id);
                if (user == null)
                  throw new ApiException($"User Not Found.");

                return new Response<UserEntity>(user);
            }
        }
    }
}


