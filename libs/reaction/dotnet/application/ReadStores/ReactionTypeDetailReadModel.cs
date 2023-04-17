using OpenSystem.Core.Application.ReadStores;

namespace OpenSystem.Reaction.Application.ReadStores
{
    public class ReactionTypeDetailReadModel : IReadModel
    {
        public string UserId { get; set; }

        public DateTimeOffset ReactedOn { get; set; }

        public bool IsRemoved { get; set; } = false;

        public DateTimeOffset? RemovedOn { get; set; }

        public ReactionTypeDetailReadModel(string userId, DateTimeOffset reactedOn)
        {
            UserId = userId;
            ReactedOn = reactedOn;
        }
    }
}
