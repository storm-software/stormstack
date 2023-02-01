using OpenSystem.Contact.Application.Queries.GetContacts;
using OpenSystem.Contact.Application.Commands.CreateContact;
using OpenSystem.Contact.Domain.Entities;
using AutoMapper;
using OpenSystem.Core.Application.Mappings;

namespace OpenSystem.Contact.Application.Mappings
{
    public class ContactMappingProfile : MappingProfile
    {
        public ContactMappingProfile()
        {
            CreateMap<ContactEntity, GetContactsViewModel>().ReverseMap();
            CreateMap<CreateContactCommand, ContactEntity>();
        }
    }
}



