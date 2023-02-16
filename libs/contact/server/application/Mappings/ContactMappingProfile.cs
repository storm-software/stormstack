using OpenSystem.Contact.Application.Queries.GetContacts;
using OpenSystem.Contact.Application.Commands.CreateContact;
using OpenSystem.Contact.Domain.Entities;
using AutoMapper;
using OpenSystem.Core.Application.Mappings;
using OpenSystem.Contact.Application.Models;
using OpenSystem.Contact.Application.Models.DTOs;
using OpenSystem.Contact.Domain.Enums;

namespace OpenSystem.Contact.Application.Mappings
{
    public class ContactMappingProfile : MappingProfile
    {
        public ContactMappingProfile()
        {
            CreateMap<ContactEntity, ContactRecord>().ReverseMap();
            CreateMap<CreateContactCommand, ContactEntity>()
              .ForMember(dest => dest.Details,
                act => act.MapFrom(src => new List<ContactDetailEntity> {
                 new ContactDetailEntity {
                    Reason = (ContactReasonTypes)Enum.Parse(typeof(ContactReasonTypes),
                      src.Reason.ToString(),
                      true),
                    CompanyName = src.CompanyName,
                    Title = src.Title,
                    Details = src.Details,
                    Url = src.Url,
                  }
                }));
            CreateMap<SubscribeCommand, ContactEntity>()
              .ForMember(dest => dest.Details,
                act => act.MapFrom(src => new List<ContactDetailEntity> {
                 new ContactDetailEntity {
                    Reason = ContactReasonTypes.Subscription,
                  }
                })
              );
        }
    }
}



