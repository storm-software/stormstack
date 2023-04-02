namespace OpenSystem.Core.Domain.ValueObjects
{
    public class MetadataId : Identity<MetadataId>, IMetadataId
    {
        public MetadataId(string value)
            : base(value) { }
    }
}
