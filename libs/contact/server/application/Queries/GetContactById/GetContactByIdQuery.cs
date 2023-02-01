using MediatR;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Application.Models;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Contact.Application.Interfaces;
using OpenSystem.Contact.Domain.Entities;

namespace OpenSystem.Contact.Application.Queries.GetContactById
{
    public class GetContactByIdQuery : IRequest<Response<ContactEntity>>
    {
        public Guid Id { get; set; }

        public class GetContactByIdQueryHandler
          : IRequestHandler<GetContactByIdQuery, Response<ContactEntity>>
        {
            private readonly IContactRepository _contactRepository;

            public GetContactByIdQueryHandler(IContactRepository contactRepository)
            {
                _contactRepository = contactRepository;
            }

            public async Task<Response<ContactEntity>> Handle(GetContactByIdQuery query,
              CancellationToken cancellationToken)
            {
                var user = await _contactRepository.GetByIdAsync(query.Id);
                if (user == null)
                  throw new NotFoundException();

                return new Response<ContactEntity>(user);
            }
        }
    }
}


