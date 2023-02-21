using AutoMapper;
using MediatR;
using OpenSystem.Core.Application.Models;
using OpenSystem.Reaction.Application.Interfaces;
using OpenSystem.Reaction.Domain.Entities;
using OpenSystem.Reaction.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Application.Models.DTOs;
using OpenSystem.Core.Application.Interfaces;

namespace OpenSystem.Reaction.Application.Commands
{
    public class AddReactionCommandHandler
      : IRequestHandler<AddReactionCommand, CommandSuccessResponse>
    {
        private readonly IReactionRepository _repository;

        private readonly IMapper _mapper;

        public AddReactionCommandHandler(IReactionRepository repository,
          IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<CommandSuccessResponse> Handle(AddReactionCommand request,
          CancellationToken cancellationToken)
        {
            var reaction = _mapper.Map<ReactionEntity>(request);
            var result = await _repository.AddOrUpdateAsync(reaction,
              cancellationToken);

            return new CommandSuccessResponse { Id = result.Id };
        }
    }
}
