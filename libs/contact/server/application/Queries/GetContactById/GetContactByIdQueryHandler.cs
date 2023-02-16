using MediatR;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Application.Models;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Contact.Application.Interfaces;
using OpenSystem.Contact.Domain.Entities;
using OpenSystem.Contact.Application.Models;
using OpenSystem.Contact.Application.Models.DTOs;
using AutoMapper;

namespace OpenSystem.Contact.Application.Queries.GetContactById
{
    public class GetContactByIdQueryHandler
      : IRequestHandler<GetContactByIdQuery, ContactRecord>
    {
        private readonly IContactRepository _contactRepository;

        private readonly IMapper _mapper;

        public GetContactByIdQueryHandler(IContactRepository contactRepository,
            IMapper mapper)
        {
            _contactRepository = contactRepository;
            _mapper = mapper;
        }


        public async Task<ContactRecord> Handle(GetContactByIdQuery query,
          CancellationToken cancellationToken)
        {
            var contact = await _contactRepository.GetByIdAsync(query.Id);
            if (contact == null)
              throw new NotFoundException();

            return _mapper.Map<ContactRecord>(contact);
        }
    }
}


