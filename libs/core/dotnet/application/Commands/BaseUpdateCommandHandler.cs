using AutoMapper;
using MediatR;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Repositories;
using OpenSystem.Core.Domain.Common;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Application.Interfaces;

namespace OpenSystem.Reaction.Application.Commands
{
    public abstract class BaseUpdateCommandHandler<TRequest, TEntity, TRepository>
        : BaseCommandHandler<TRequest, TEntity>
        where TRequest : class, ICommand
        where TEntity : AggregateRoot
        where TRepository : IBaseRepository<TEntity>
    {
        protected TRepository Repository { get; init; }

        public BaseUpdateCommandHandler(
            TRepository repository,
            IMapper mapper,
            ILogger<BaseUpdateCommandHandler<TRequest, TEntity, TRepository>> logger
        )
            : base(mapper, logger)
        {
            Repository = repository;
        }

        protected async override sealed ValueTask<IVersionedIndex> InnerHandleAsync(
            TEntity entity,
            TRequest request,
            CancellationToken cancellationToken
        )
        {
            entity = await HandleCommandAsync(entity, request, cancellationToken);

            await SaveChangesAsync(cancellationToken);

            return entity;
        }

        protected virtual Task<TEntity> HandleCommandAsync(
            TEntity entity,
            TRequest request,
            CancellationToken cancellationToken
        )
        {
            return Task.FromResult(entity);
        }

        protected async override ValueTask<TEntity> MapRequestAsync(
            TRequest request,
            CancellationToken cancellationToken
        )
        {
            return await Repository.AddOrUpdateAsync<TRequest>(request, cancellationToken);
        }

        protected async virtual ValueTask SaveChangesAsync(CancellationToken cancellationToken)
        {
            await Repository.UnitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}
