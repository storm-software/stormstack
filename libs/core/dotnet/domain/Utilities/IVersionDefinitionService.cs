using OpenSystem.Core.Domain.Attributes;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Utilities
{
    public interface IVersionDefinitionService<TAttribute, TDefinition>
        where TAttribute : VersionAttribute
        where TDefinition : VersionDefinition
    {
        void Load(IReadOnlyCollection<Type> types);

        IEnumerable<TDefinition> GetDefinitions(string name);

        bool TryGetDefinition(string name, uint version, out TDefinition definition);

        IEnumerable<TDefinition> GetAllDefinitions();

        TDefinition GetDefinition(string name, uint version);

        TDefinition GetDefinition(Type type);

        IReadOnlyCollection<TDefinition> GetDefinitions(Type type);

        bool TryGetDefinition(Type type, out TDefinition definition);

        bool TryGetDefinitions(Type type, out IReadOnlyCollection<TDefinition> definitions);

        void Load(params Type[] types);
    }
}
