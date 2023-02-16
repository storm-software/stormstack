using AutoMapper;
using MediatR;
using OpenSystem.Core.Application.Models;
using OpenSystem.Contact.Application.Interfaces;
using OpenSystem.Contact.Domain.Entities;
using OpenSystem.Contact.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;
using OpenSystem.Contact.Application.Models;
using OpenSystem.Contact.Application.Models.DTOs;
using OpenSystem.Core.Application.Interfaces;

namespace OpenSystem.Contact.Application.Commands.CreateContact
{
    public class SubscribeCommandHandler
      : IRequestHandler<SubscribeCommand, CommandSuccessResponse>
    {
        private readonly IContactRepository _repository;

        private readonly IMapper _mapper;

        public SubscribeCommandHandler(IContactRepository repository,
          IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<CommandSuccessResponse> Handle(SubscribeCommand request,
          CancellationToken cancellationToken)
        {
            var contact = _mapper.Map<ContactEntity>(request);
            await _repository.AddAsync(contact,
              cancellationToken);

            return new CommandSuccessResponse { Id = contact.Id };
        }
    }
}
