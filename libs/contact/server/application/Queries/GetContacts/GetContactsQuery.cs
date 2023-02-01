using AutoMapper;
using MediatR;
using OpenSystem.Contact.Application.Interfaces;
using OpenSystem.Core.Application.Models.Parameters;
using OpenSystem.Core.Application.Models;
using OpenSystem.Contact.Domain.Entities;
using OpenSystem.Contact.Domain.Enums;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Contact.Application.Interfaces;
using OpenSystem.Core.Domain.Entities;

namespace OpenSystem.Contact.Application.Queries.GetContacts
{
    public class GetContactsQuery
      : QueryParameter, IRequest<PagedResponse<IEnumerable<Entity<Guid>>>>
    {
        public Guid? Id { get; set; }

        public string? Email { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }
    }

    public class GetContactsQueryHandler
      : IRequestHandler<GetContactsQuery, PagedResponse<IEnumerable<Entity<Guid>>>>
    {
        private readonly IContactRepository _contactRepository;

        private readonly IMapper _mapper;

        private readonly IModelHelper _modelHelper;

        public GetContactsQueryHandler(IContactRepository contactRepository,
          IMapper mapper,
          IModelHelper modelHelper)
        {
            _contactRepository = contactRepository;
            _mapper = mapper;
            _modelHelper = modelHelper;
        }

        public async Task<PagedResponse<IEnumerable<Entity<Guid>>>> Handle(GetContactsQuery request,
          CancellationToken cancellationToken)
        {
            var validFilter = request;
            //filtered fields security
            if (!string.IsNullOrEmpty(validFilter.Fields))
            {
                //limit to fields in view model
                validFilter.Fields = _modelHelper.ValidateModelFields<GetContactsViewModel>(validFilter.Fields);
            }
            if (string.IsNullOrEmpty(validFilter.Fields))
            {
                //default fields from view model
                validFilter.Fields = _modelHelper.GetModelFields<GetContactsViewModel>();
            }

            // query based on filter
            var result = await _contactRepository.GetContactsAsync(validFilter);
            var data = result.data;
            RecordsCount recordCount = result.recordsCount;

            // Result wrapper
            return new PagedResponse<IEnumerable<Entity<Guid>>>((List<IEnumerable<Entity<Guid>>>)data,
              validFilter.PageNumber,
              validFilter.PageSize,
              recordCount);
        }
    }
}
