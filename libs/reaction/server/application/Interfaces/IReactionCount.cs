using System.Collections.Generic;
using System.Threading.Tasks;

namespace OpenSystem.Reaction.Application.Interfaces
{
    public interface IReactionCount
    {
        string Type { get; set; }

        int Count { get; set; }
    }
}
