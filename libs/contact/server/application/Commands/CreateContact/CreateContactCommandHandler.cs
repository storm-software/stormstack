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
    public class CreateContactCommandHandler
      : IRequestHandler<CreateContactCommand, CommandSuccessResponse>
    {
        private readonly IContactRepository _repository;

        private readonly IMapper _mapper;

        public CreateContactCommandHandler(IContactRepository repository,
          IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<CommandSuccessResponse> Handle(CreateContactCommand request,
          CancellationToken cancellationToken)
        {
            var contact = _mapper.Map<ContactEntity>(request);
            var result = await _repository.AddOrUpdateAsync(contact,
              cancellationToken);

            return new CommandSuccessResponse { Id = result.Id };
        }
    }
}
