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
using AutoMapper;
using OpenSystem.Reaction.Domain.Repositories;
using OpenSystem.Core.Domain.Constants;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Infrastructure.Persistence.Extensions;
using System.Linq;

namespace OpenSystem.Reaction.Infrastructure.Persistence
{
    public class ReactionReadOnlyRepository
        : BaseReadOnlyRepository<ReactionEntity>,
            IReactionReadOnlyRepository
    {
        private readonly DbSet<ReactionEntity> _reactions;

        private readonly DbSet<ReactionDetailEntity> _reactionDetails;

        public ReactionReadOnlyRepository(
            ReactionDbContext dbContext,
            ICurrentUserService currentUserService,
            IDateTimeProvider dateTimeProvider
        )
            : base(dbContext, currentUserService, dateTimeProvider)
        {
            _reactions = dbContext.Reaction;
            _reactionDetails = dbContext.ReactionDetail;
        }

        public async Task<Paged<ReactionEntity>> GetReactionsAsync(
            string? contentId,
            string? type,
            int? pageSize = DefaultConfiguration.DefaultSearchPageSize,
            int? pageNumber = 0,
            string? orderBy = null,
            string? fields = null
        )
        {
            // Setup IQueryable
            var record = GetQueryable(pageNumber, pageSize, orderBy);
            record = record.Include(r => r.Details);

            // filter data
            FilterByColumn(ref record, contentId, type);

            // set order by
            if (!string.IsNullOrWhiteSpace(orderBy))
                record = record.OrderBy(orderBy);

            // retrieve data to list
            // var resultData = await record.ToListAsync();
            return await Paged<ReactionEntity>.CreateAsync(
                record,
                pageNumber,
                pageSize,
                await DataSet.CountAsync(),
                record.Count()
            );
        }

        public async Task<IList<(string Type, int Count)>> GetReactionsCountAsync(
            string contentId,
            string? type
        )
        {
            var record = GetQueryable();
            record = record.Include(r => r.Details);

            // filter data
            FilterByColumn(ref record, contentId, type);
            var resultData = await record.ToListAsync();

            // retrieve data to list
            var data = resultData
                .SelectMany(r => r.Details)
                .GroupBy(d => d.Type)
                .Select(d => (d.Key.ToString(), d.Count()));

            if (!string.IsNullOrEmpty(type))
                data = data.Where(r => r.Item1.ToUpper() == type.Trim().ToUpper());

            return data.ToList();
        }

        public async Task<ReactionEntity?> GetByContentIdAsync(string contentId)
        {
            return !string.IsNullOrEmpty(contentId)
                ? await GetQueryable()
                    .IgnoreQueryFilters()
                    .Include(r => r.Details)
                    .FirstOrDefaultAsync(r => r.ContentId.ToUpper() == contentId.Trim().ToUpper())
                : null;
        }

        public async Task<bool> UserHasReactedAsync(string contentId)
        {
            return !string.IsNullOrEmpty(contentId)
                && await GetQueryable()
                    .Include(r => r.Details)
                    .Where(r => r.ContentId.ToUpper() == contentId.Trim().ToUpper())
                    .AnyAsync(
                        r =>
                            r.Details.Any(
                                d =>
                                    !string.IsNullOrEmpty(CurrentUserService.UserId)
                                    && d.UserId.ToUpper() == CurrentUserService.UserId.ToUpper()
                            )
                    );
        }

        private void FilterByColumn(
            ref IQueryable<ReactionEntity> reactions,
            string? contentId,
            string? type
        )
        {
            if (!reactions.Any())
                return;

            var predicate = PredicateBuilder.New<ReactionEntity>();
            if (!string.IsNullOrEmpty(contentId) || !string.IsNullOrEmpty(type))
            {
                if (!string.IsNullOrEmpty(contentId))
                    predicate = predicate.And(
                        p => p.ContentId.ToUpper() == contentId.Trim().ToUpper()
                    );

                if (!string.IsNullOrEmpty(type))
                    predicate = predicate.And(
                        r =>
                            r.Details.Any(
                                d =>
                                    d.Type
                                    == (ReactionTypes)
                                        Enum.Parse(typeof(ReactionTypes), type.Trim(), true)
                            )
                    );
            }

            reactions = reactions.Where(predicate);
        }
    }
}
