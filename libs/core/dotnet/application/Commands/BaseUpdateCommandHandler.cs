using AutoMapper;
using MediatR;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Repositories;
using OpenSystem.Core.Domain.Common;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Domain.Aggregates;

namespace OpenSystem.Core.Application.Commands
{
    public abstract class BaseUpdateCommandHandler<TAggregate, TIdentity, TRequest>
        : BaseCommandHandler<TAggregate, TIdentity, TRequest>
        where TRequest : class, ICommand<TAggregate, TIdentity>
        where TAggregate : IAggregateRoot<TIdentity>
        where TIdentity : IIdentity
    {
        public BaseUpdateCommandHandler(
            IMapper mapper,
            ILogger<BaseUpdateCommandHandler<TAggregate, TIdentity, TRequest>> logger
        )
            : base(mapper, logger) { }

        protected async override sealed ValueTask<IVersionedIndex<IIdentity>> InnerHandleAsync(
            TAggregate entity,
            TRequest request,
            CancellationToken cancellationToken
        )
        {
            entity = await HandleCommandAsync(entity, request, cancellationToken)
                .ConfigureAwait(false);

            // await SaveChangesAsync(cancellationToken);

            return (IVersionedIndex<IIdentity>)entity;
        }

        protected virtual Task<TAggregate> HandleCommandAsync(
            TAggregate entity,
            TRequest request,
            CancellationToken cancellationToken
        )
        {
            return Task.FromResult(entity);
        }

        /*protected async override ValueTask<TAggregate> MapRequestAsync(
            TRequest request,
            CancellationToken cancellationToken
        )
        {
            return await Repository.AddOrUpdateAsync<TRequest>(request, cancellationToken);
        }

        protected async virtual ValueTask SaveChangesAsync(CancellationToken cancellationToken)
        {
            await Repository.UnitOfWork.SaveChangesAsync(cancellationToken);
        }*/
    }
}
