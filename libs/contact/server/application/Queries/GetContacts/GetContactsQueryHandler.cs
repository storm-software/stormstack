using AutoMapper;
using MediatR;
using OpenSystem.Contact.Application.Interfaces;
using OpenSystem.Core.Application.Models.Parameters;
using OpenSystem.Core.Application.Models;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Contact.Application.Models;
using OpenSystem.Contact.Application.Models.DTOs;

namespace OpenSystem.Contact.Application.Queries.GetContacts
{
    public class GetContactsQueryHandler
      : IRequestHandler<GetContactsQuery, GetContacts200Response>
    {
        private readonly IContactRepository _contactRepository;

        private readonly IMapper _mapper;

        public GetContactsQueryHandler(IContactRepository contactRepository,
          IMapper mapper)
        {
            _contactRepository = contactRepository;
            _mapper = mapper;
        }

        public async Task<GetContacts200Response> Handle(GetContactsQuery request,
          CancellationToken cancellationToken)
        {
            // query based on filter
            var result = await _contactRepository.GetContactsAsync(request);
            var data = _mapper.Map<List<ContactRecord>>(result.Data);

            return new GetContacts200Response {
              Data = data,
              PageNumber = request.PageNumber,
              PageSize = request.PageSize,
              RecordsTotal = result.RecordsCount.RecordsTotal,
              RecordsFiltered = result.RecordsCount.RecordsFiltered
            };
        }
    }
}
