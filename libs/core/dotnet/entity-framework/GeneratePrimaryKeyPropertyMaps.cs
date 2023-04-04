using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper.EquivalencyExpression;
using OpenSystem.Core.EntityFramework.Extensions;
using Microsoft.EntityFrameworkCore.Metadata;

namespace OpenSystem.Core.EntityFramework
{
    public class GeneratePrimaryKeyPropertyMaps : IGeneratePropertyMaps
    {
        private readonly IModel _model;

        public GeneratePrimaryKeyPropertyMaps() =>
            throw new InvalidOperationException(
                $"Use {nameof(MapperConfigurationExpressionExtensions.UseEFCoreModel)} instead of using SetGeneratePropertyMaps."
            );

        public GeneratePrimaryKeyPropertyMaps(IModel model) => _model = model;

        public IEnumerable<PropertyMap> GeneratePropertyMaps(TypeMap typeMap)
        {
            var propertyMaps = typeMap.PropertyMaps;
            var keys =
                _model.FindEntityType(typeMap.DestinationType)?.GetKeys() ?? new List<IKey>();

            // var keyMembers =   new List<IProperty>()
            return propertyMaps.Where(
                p =>
                    keys.SelectMany(key => key.Properties)
                        .Any(key => key.Name == p.DestinationMember.Name)
            );
        }
    }
}
