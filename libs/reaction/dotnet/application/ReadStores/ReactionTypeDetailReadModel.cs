using OpenSystem.Core.Application.ReadStores;

namespace OpenSystem.Reaction.Application.ReadStores
{
    public class ReactionTypeDetailReadModel : IReadModel
    {
        public string UserId { get; set; }

        public DateTimeOffset ReactedOn { get; set; }

        public ReactionTypeDetailReadModel(string userId, DateTimeOffset reactedOn)
        {
            UserId = userId;
            ReactedOn = reactedOn;
        }
    }
}
