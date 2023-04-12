using OpenSystem.Reaction.Domain.Entities;
using AutoMapper;
using OpenSystem.Core.Application.Mappings;
using OpenSystem.Reaction.Application.Models.DTOs;
using OpenSystem.Reaction.Application.ReadStores;

namespace OpenSystem.Reaction.Application.Mappings
{
    public class ReactionMappingProfile : MappingProfile
    {
        public ReactionMappingProfile()
        {
            /*CreateMap<AddReactionCommand, ReactionEntity>()
                .ForMember(
                    dest => dest.Details,
                    act =>
                        act.MapFrom(
                            src =>
                                new List<ReactionDetailEntity>
                                {
                                    new ReactionDetailEntity
                                    {
                                        Type = (ReactionTypes)
                                            Enum.Parse(
                                                typeof(ReactionTypes),
                                                src.Payload.Type.ToString(),
                                                true
                                            )
                                    }
                                }
                        )
                );

            CreateMap<RemoveReactionCommand, ReactionEntity>();
            CreateMap<ReactionEntity, ReactionDetailRecord>().ReverseMap();

            CreateMap<(string Type, int Count), ReactionCountRecord>()
                .ForMember(dest => dest.Type, act => act.MapFrom(src => src.Type))
                .ForMember(dest => dest.Count, act => act.MapFrom(src => src.Count));
            CreateMap<List<(string Type, int Count)>, List<ReactionCountRecord>>();*/

            CreateMap<ReactionDetailEntity, ReactionCountRecord>();
            CreateMap<ReactionReadModel, GetReactionsCount200Response>()
                .ForMember(dest => dest.Data, act => act.MapFrom(src => src.Types));
        }
    }
}
