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
using OpenSystem.Reaction.Application.Models;
using OpenSystem.Reaction.Application.Models.DTOs;
using OpenSystem.Core.Infrastructure.Extensions;
using Serilog;
using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Reaction.Infrastructure.Persistence
{
    public class ReactionRepository
      : GenericRepository<ReactionEntity>, IReactionRepository
    {
        private readonly DbSet<ReactionEntity> _reactions;

        private readonly DbSet<ReactionDetailEntity> _reactionDetails;

        private readonly ICurrentUserService _currentUserService;

        private readonly ILogger _logger;

        public ReactionRepository(ReactionDbContext dbContext,
          ICurrentUserService currentUserService,
          ILogger logger)
            : base(dbContext)
        {
            _reactions = dbContext.Set<ReactionEntity>();
            _reactionDetails = dbContext.Set<ReactionDetailEntity>();

            _currentUserService = currentUserService;
            _logger = logger;
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
            /*IQueryable<ReactionEntity> record = _reactions
              .Include(r => r.Details);

            //record = record.Include(r => r.Details);

  _logger.Information(record.Count().ToString());
_logger.Information(record.Count() > 0
            ? record.First().Details.Count().ToString()
            : "");
*/

          var record = _reactions
            .AsNoTracking()
            .AsExpandable();
          record = record.Include(r => r.Details);

            // filter data
            Result ret = FilterByColumn(ref record,
              contentId,
              type);
            if (ret.Failed)
              throw new GeneralProcessingException();

           _logger.Information(record.Count().ToString());
          _logger.Information(record.Count() > 0
            ? record.First().Details.Count().ToString()
            : "");

            // retrieve data to list
            var resultData = record.SelectMany(r => r.Details)
              .Where(d => d.VerificationCode == VerificationCodeTypes.Verified)
              .GroupBy(d => d.Type)
              .Select(d => new ReactionCountRecord {
                Type = Char.ToLowerInvariant(d.Key.ToString()[0])
                    + d.Key.ToString().Substring(1),
                Count = d.Count()
              });

           _logger.Information(resultData.Count().ToString());

            if (!string.IsNullOrEmpty(type))
                resultData = resultData.Where(r => string.Equals(r.Type,
                  type.Trim()));

            _logger.Information(resultData.Count().ToString());

            return resultData;
        }

        public async Task<ReactionEntity?> GetByContentIdAsync(string contentId)
        {
          return await _reactions
            .FirstOrDefaultAsync(r => r.ContentId == contentId);
        }

        public async Task<bool> UserHasReactedAsync(string contentId)
        {
          return await _reactions
                .AllAsync(r => r.ContentId == contentId &&
                  r.Details.Any(d => d.VerificationCode == VerificationCodeTypes.Verified &&
                    string.Equals(_currentUserService.UserId,
                      d.UserId)));
        }

        protected override async Task<ReactionEntity> InnerAddAsync(ReactionEntity entity,
          CancellationToken cancellationToken = default)
        {
          foreach (ReactionDetailEntity detail in entity.Details)
          {
            DbContext.Entry(detail).State = EntityState.Added;

            detail.UserId = _currentUserService.UserId;
          }

          await _reactionDetails.AddRangeAsync(entity.Details,
            cancellationToken);

          return entity;
        }

        protected override async Task InnerUpdateAsync(ReactionEntity entity,
          CancellationToken cancellationToken = default)
        {
          foreach (ReactionDetailEntity detail in entity.Details)
            DbContext.Entry(detail).State = EntityState.Modified;
        }

        protected override async Task InnerDeleteAsync(ReactionEntity entity,
          CancellationToken cancellationToken = default)
        {
          foreach (ReactionDetailEntity detail in entity.Details)
            DbContext.Entry(detail).State = EntityState.Deleted;

          _reactionDetails.RemoveRange(entity.Details);
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
