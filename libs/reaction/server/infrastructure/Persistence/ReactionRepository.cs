using OpenSystem.Reaction.Application.Queries;
using OpenSystem.Core.Application.Models;
using OpenSystem.Reaction.Application.Interfaces;
using OpenSystem.Reaction.Domain.Entities;
using OpenSystem.Reaction.Domain.Enums;
using LinqKit;
using Microsoft.EntityFrameworkCore;

using System.Linq.Dynamic.Core;
using OpenSystem.Core.Infrastructure.Persistence;
using OpenSystem.Core.Application.Services;
using AutoMapper.EntityFrameworkCore;
using AutoMapper;
using OpenSystem.Reaction.Domain.Repositories;
using OpenSystem.Core.Domain.Constants;
using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Reaction.Infrastructure.Persistence
{
    public class ReactionRepository
      : BaseRepository<ReactionEntity>, IReactionRepository
    {
        private readonly DbSet<ReactionEntity> _reactions;

        private readonly DbSet<ReactionDetailEntity> _reactionDetails;

        public ReactionRepository(IMapper mapper,
          ReactionDbContext dbContext,
          ICurrentUserService currentUserService,
          IDateTimeProvider dateTimeProvider)
            : base(mapper,
              dbContext,
              currentUserService,
              dateTimeProvider)
        {
            _reactions = dbContext.Reaction;
            _reactionDetails = dbContext.ReactionDetail;
        }

        public async Task<Core.Domain.ResultCodes.PagedResult<ReactionEntity>> GetReactionsAsync(string? contentId,
          string? type,
          int? pageSize = DefaultConfiguration.DefaultSearchPageSize,
          int? pageNumber = 0,
          string? orderBy = null,
          string? fields = null)
        {
            // Setup IQueryable
            var record = GetQueryable(pageNumber,
              pageSize,
              orderBy);
            record = record.Include(r => r.Details);

            // filter data
            FilterByColumn(ref record,
              contentId,
              type);

            // set order by
            if (!string.IsNullOrWhiteSpace(orderBy))
                record = record.OrderBy(orderBy);

            // retrieve data to list
            var resultData = await record.ToListAsync();
            return Core.Domain.ResultCodes.PagedResult<ReactionEntity>.Success(resultData,
              await DataSet.CountAsync());
        }

        public async Task<Core.Domain.ResultCodes.PagedResult<(string Type, int Count)>> GetReactionsCountAsync(string? contentId,
          string? type,
          int? pageSize = DefaultConfiguration.DefaultSearchPageSize,
          int? pageNumber = 0,
          string? orderBy = null,
          string? fields = null)
        {
            var record = GetQueryable();
            record = record.Include(r => r.Details);

            // filter data
            FilterByColumn(ref record,
              contentId,
              type);
            var resultData = await record.ToListAsync();

            // retrieve data to list
            var data = resultData.SelectMany(r => r.Details)
              .GroupBy(d => d.Type)
              .Select(d => (
                d.Key.ToString(),
                d.Count()
              ));

            if (!string.IsNullOrEmpty(type))
                data = data.Where(r => r.Item1.ToUpper() == type.Trim().ToUpper());

            return Core.Domain.ResultCodes.PagedResult<(string Type, int Count)>.Success(data.ToList(),
              await DataSet.CountAsync());
        }

        public async Task<ReactionEntity?> GetByContentIdAsync(string contentId)
        {
          return await GetQueryable(false)
            .IgnoreQueryFilters()
            .Include(r => r.Details)
            .FirstOrDefaultAsync(r => r.ContentId == contentId);
        }

        public async Task<bool> UserHasReactedAsync(string contentId)
        {
          return await GetQueryable(false)
            .AllAsync(r => r.ContentId == contentId &&
              r.Details.Any(d => !string.IsNullOrEmpty(CurrentUserService.UserId) &&
                d.UserId.ToUpper() == CurrentUserService.UserId.ToUpper() &&
                d.Status == EntityStatusTypes.Active));
        }

        protected override async ValueTask<ReactionEntity> InnerAddAsync(ReactionEntity entity,
          CancellationToken cancellationToken = default)
        {
          foreach (ReactionDetailEntity detail in entity.Details)
          {
            //DbContext.Entry(detail).State = EntityState.Added;
            detail.UserId = CurrentUserService.UserId;
          }

          await _reactionDetails.AddRangeAsync(entity.Details,
              cancellationToken);

          return entity;
        }

        protected override async ValueTask<ReactionEntity> InnerUpdateAsync(ReactionEntity entity,
          CancellationToken cancellationToken = default)
        {
          /*foreach (ReactionDetailEntity detail in entity.Details)
            DbContext.Entry(detail).State = EntityState.Modified;

          foreach (ReactionDetailEntity detail in entity.Details)
          {
            if (entity.)
              _reactionDetails.Remove(detail);
          }*/

          return entity;
        }

        protected override async ValueTask<ReactionEntity> InnerDeleteAsync(ReactionEntity entity,
          CancellationToken cancellationToken = default)
        {
          foreach (ReactionDetailEntity detail in entity.Details)
            _reactionDetails.Remove(detail);

          return entity;
        }

        private void FilterByColumn(ref IQueryable<ReactionEntity> reactions,
          string? contentId,
          string? type)
        {
            if (!reactions.Any())
                return;

            var predicate = PredicateBuilder.New<ReactionEntity>();
            if (!string.IsNullOrEmpty(contentId) ||
              !string.IsNullOrEmpty(type))
            {
              if (!string.IsNullOrEmpty(contentId))
                  predicate = predicate.And(p =>
                    p.ContentId.ToUpper() == contentId.Trim().ToUpper());

              if (!string.IsNullOrEmpty(type))
                  predicate = predicate.And(r =>
                    r.Details.Any(d => d.Type ==
                      (ReactionTypes)Enum.Parse(typeof(ReactionTypes),
                      type.Trim(),
                      true)));
            }

            reactions = reactions.Where(predicate);
        }
  }
}
