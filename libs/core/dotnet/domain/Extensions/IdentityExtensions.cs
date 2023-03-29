using System.Text;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Extensions
{
    public static class IdentityExtensions
    {
        public static byte[] GetBytes(this IIdentity identity)
        {
            return Encoding.UTF8.GetBytes(identity.Value);
        }
    }
}
