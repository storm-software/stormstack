using OpenSystem.Reaction.Application.Queries;
using OpenSystem.Core.Application.Models;
using OpenSystem.Reaction.Application.Interfaces;
using OpenSystem.Reaction.Domain.Entities;
using OpenSystem.Reaction.Domain.Enums;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using OpenSystem.Core.Infrastructure.Persistence;
using OpenSystem.Core.Application.Models.Parameters;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Application.Models.DTOs;

namespace OpenSystem.Reaction.Infrastructure.Persistence
{
    public class ReactionRepository
      : GenericRepository<ReactionEntity>, IReactionRepository
    {
        private readonly DbSet<ReactionEntity> _reactions;

        private readonly ICurrentUserService _currentUserService;

        public ReactionRepository(ReactionDbContext dbContext,
          ICurrentUserService currentUserService)
            : base(dbContext)
        {
            _reactions = dbContext.Set<ReactionEntity>();
            _currentUserService = currentUserService;
        }

        public async Task<(IEnumerable<ReactionEntity> Data,
          RecordsCount RecordsCount)> GetReactionsAsync(GetReactionsQuery requestParameter)
        {
            var contentId = requestParameter.ContentId;
            var type = requestParameter.Type;

            var pageNumber = requestParameter.PageNumber;
            var pageSize = requestParameter.PageSize;
            var orderBy = requestParameter.OrderBy;

            int recordsTotal, recordsFiltered;

            // Setup IQueryable
            var record = _reactions
                .AsNoTracking()
                .AsExpandable();

            // Count records total
            recordsTotal = await record.CountAsync();

            // filter data
            Result ret = FilterByColumn(ref record,
              contentId,
              type);
            if (ret.Failed)
              throw new GeneralProcessingException();

            // Count records after filter
            recordsFiltered = await record.CountAsync();

            //set Record counts
            var recordsCount = new RecordsCount(recordsFiltered,
                recordsTotal);

            // set order by
            if (!string.IsNullOrWhiteSpace(orderBy))
            {
                record = record.OrderBy(orderBy);
            }

            // paging
            record = record
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize);

            // retrieve data to list
            var resultData = await record.ToListAsync();
            return (resultData, recordsCount);
        }

        public async Task<IEnumerable<ReactionCountRecord>> GetReactionsCountAsync(GetReactionsCountQuery requestParameter)
        {
            var contentId = requestParameter.ContentId;
            var type = requestParameter.Type;

            // Setup IQueryable
            var record = _reactions
                .AsNoTracking()
                .AsExpandable();

            // filter data
            Result ret = FilterByColumn(ref record,
              contentId,
              type);
            if (ret.Failed)
              throw new GeneralProcessingException();

            // retrieve data to list
            var resultData = record.SelectMany(r =>
              r.Details.GroupBy(d => d.Type)
                .Select(d =>
                  new ReactionCountRecord { Type = Char.ToLowerInvariant(d.Key.ToString()[0])
                      + d.Key.ToString().Substring(1),
                    Count = d.Count() }));

            if (!string.IsNullOrEmpty(type))
                resultData = resultData.Where(r => string.Equals(r.Type,
                  type.Trim()));

            return await resultData.ToListAsync();
        }

        public async Task<bool> UserHasReactedAsync(string contentId)
        {
          return await _reactions
                .AllAsync(r => r.ContentId == contentId &&
                  r.Details.Any(d => string.Equals(_currentUserService.UserId,
                    d.UserId)));
        }

        private Result FilterByColumn(ref IQueryable<ReactionEntity> reactions,
          string? contentId,
          string? type)
        {
            if (!reactions.Any())
                return Result.Success();

            if (string.IsNullOrEmpty(contentId) &&
              string.IsNullOrEmpty(type))
                return Result.Success();

            var predicate = PredicateBuilder.New<ReactionEntity>();
            if (!string.IsNullOrEmpty(contentId))
                predicate = predicate.Or(p =>
                  p.ContentId.Contains(contentId.Trim()));

            if (!string.IsNullOrEmpty(type))
                predicate = predicate.Or(r =>
                  r.Details.Any(d => string.Equals(d.Type,
                    type.Trim())));

            reactions = reactions.Where(predicate);

            return Result.Success();
        }
  }
}
