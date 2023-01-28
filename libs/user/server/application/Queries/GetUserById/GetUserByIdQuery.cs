using MediatR;
using OpenSystem.Core.DotNet.WebApi.Exceptions;
using OpenSystem.User.Application.Interfaces.Repositories;
using OpenSystem.User.Application.Models;
using OpenSystem.User.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace OpenSystem.User.Application.Queries.GetUserById
{
    public class GetUserByIdQuery : IRequest<Result>
    {
        public Guid Id { get; set; }

        public class GetUserByIdQueryHandler
          : IRequestHandler<GetUserByIdQuery, Result>
        {
            private readonly IUserRepository _userRepository;

            public GetUserByIdQueryHandler(IUserRepository userRepository)
            {
                _userRepository = userRepository;
            }

            public async Task<Result> Handle(GetUserByIdQuery query,
              CancellationToken cancellationToken)
            {
                var user = await _userRepository.GetByIdAsync(query.Id);
                if (user == null)
                  throw new ApiException($"User Not Found.");

                return new Result(user);
            }
        }
    }
}


