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
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Extensions;
using Serilog;

namespace OpenSystem.Reaction.Application.Commands
{
    public class AddReactionCommandHandler
      : IRequestHandler<AddReactionCommand, CommandSuccessResponse>
    {
        private readonly IReactionRepository _repository;

        private readonly IMapper _mapper;

        private readonly ILogger _logger;

        public AddReactionCommandHandler(IReactionRepository repository,
          IMapper mapper,
          ILogger logger)
        {
            _repository = repository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<CommandSuccessResponse> Handle(AddReactionCommand request,
          CancellationToken cancellationToken)
        {
            var reaction = _mapper.Map<ReactionEntity>(request);

            _logger.Information(reaction?.ToString());
            _logger.Information(reaction.Details.Count().ToString());
            var existing = await _repository.GetByContentIdAsync(request.ContentId);
            if (existing != null) {
              if (existing.IsDisabled)
                foreach (ReactionDetailEntity rde in reaction.Details)
                  rde.VerificationCode = VerificationCodeTypes.Unverified;

              existing.CopyTo(reaction);
            }

            _logger.Information(reaction.Details.Count().ToString());

            var result = await _repository.AddOrUpdateAsync(reaction,
              cancellationToken);

            return new CommandSuccessResponse { Id = result.Id };
        }
    }
}
