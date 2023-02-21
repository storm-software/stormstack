using OpenSystem.Reaction.Domain.Entities;
using AutoMapper;
using OpenSystem.Core.Application.Mappings;
using OpenSystem.Reaction.Application.Interfaces;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Application.Models.DTOs;
using OpenSystem.Reaction.Domain.Enums;

namespace OpenSystem.Reaction.Application.Mappings
{
    public class ReactionMappingProfile : MappingProfile
    {
        public ReactionMappingProfile()
        {
            CreateMap<AddReactionCommand, ReactionEntity>()
              .ForMember(dest => dest.Details,
                act => act.MapFrom(src => new List<ReactionDetailEntity> {
                 new ReactionDetailEntity {
                    Type = (ReactionTypes)Enum.Parse(typeof(ReactionTypes),
                      src.Type.ToString(),
                      true)
                  }
                }));
            CreateMap<RemoveReactionCommand, ReactionEntity>();
            CreateMap<ReactionEntity, ReactionDetailRecord>()
              .ReverseMap();
            CreateMap<IReactionCount, ReactionCountRecord>()
              .ReverseMap();
            CreateMap<List<ReactionCountRecord>, GetReactionsCount200Response>()
              .ForMember(dest => dest.Data,
                act => act.MapFrom(src => src));
        }
    }
}



