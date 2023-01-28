using AutoMapper;

namespace OpenSystem.Core.DotNet.Application.Mappings
{
  public interface IMapFrom<T>
  {
    void Mapping(Profile profile) => profile.CreateMap(typeof(T), GetType());
  }
}
