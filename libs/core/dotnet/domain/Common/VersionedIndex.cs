using System.Text;
using OpenSystem.Core.Domain.Constants;

namespace OpenSystem.Core.Domain.Common
{
    public class VersionedIndex<TIdentity> : Indexed<TIdentity>, IVersionedIndex<TIdentity>
        where TIdentity : IIdentity
    {
        public ulong Version { get; set; } = 0;

        public VersionedIndex(IIdentity id, ulong version)
        {
            Id = id;
            Version = version;
        }

        public override string ToString()
        {
            try
            {
                StringBuilder sb = new StringBuilder();

                sb.Append($"Type: Versioned Index {Literals.NewLine}");
                sb.Append($"Id: {Id.Value} {Literals.NewLine}");
                sb.Append($"Version: {Version} {Literals.NewLine}");

                return sb.ToString();
            }
            catch (Exception x)
            {
                return x.Message;
            }
        }
    }
}
