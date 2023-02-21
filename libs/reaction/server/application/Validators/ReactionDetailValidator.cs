using FluentValidation;
using OpenSystem.Reaction.Application.Interfaces;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Domain.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace OpenSystem.Reaction.Application.Validators
{
    public class ReactionDetailValidator : AbstractValidator<ReactionDetailEntity>
    {
        public ReactionDetailValidator()
        {
            RuleFor(reactionDetail => reactionDetail.Type).IsInEnum();
        }
    }
}


