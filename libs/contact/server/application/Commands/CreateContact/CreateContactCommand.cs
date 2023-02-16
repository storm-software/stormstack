using AutoMapper;
using MediatR;
using OpenSystem.Core.Application.Models;
using OpenSystem.Contact.Application.Interfaces;
using OpenSystem.Contact.Domain.Entities;
using OpenSystem.Contact.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace OpenSystem.Contact.Application.Commands.CreateContact
{
    public partial class CreateContactCommand
      : IRequest<Response<Guid>>
    {
        public string Email { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? PhoneNumber { get; set; }

        public bool IsSubscribed { get; set; }

        public ContactReasonTypes Reason { get; set; }

        public string? Comment { get; set; }

        public string Url { get; set; }
    }

    public class CreateContactCommandHandler
      : IRequestHandler<CreateContactCommand, Response<Guid>>
    {
        private readonly IContactRepository _contactRepository;

        private readonly IMapper _mapper;

        public CreateContactCommandHandler(IContactRepository contactRepository,
          IMapper mapper)
        {
            _contactRepository = contactRepository;
            _mapper = mapper;
        }

        public async Task<Response<Guid>> Handle(CreateContactCommand request,
          CancellationToken cancellationToken)
        {
            var contact = _mapper.Map<ContactEntity>(request);
            await _contactRepository.AddAsync(contact);

            return new Response<Guid>(contact.Id);
        }
    }
}
