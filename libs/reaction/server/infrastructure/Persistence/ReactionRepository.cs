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

        public ReactionRepository(ReactionDbContext dbContext,
          ICurrentUserService currentUserService,
          ILogger logger)
            : base(dbContext)
        {
            _reactions = dbContext.Reaction;
            _reactionDetails = dbContext.ReactionDetail;

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
            var record = GetQueryable(pageNumber,
              pageSize,
              orderBy);
            record = record.Include(r => r.Details);

            // Count records total
            recordsTotal = await DbSet.CountAsync();

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

            // retrieve data to list
            var resultData = await record.ToListAsync();
            return (resultData, recordsCount);
        }

        public async Task<IEnumerable<ReactionCountRecord>> GetReactionsCountAsync(GetReactionsCountQuery requestParameter)
        {
            var record = GetQueryable();
            record = record.Include(r => r.Details);

            // filter data
            Result ret = FilterByColumn(ref record,
              requestParameter.ContentId,
              requestParameter.Type);
            if (ret.Failed)
              throw new GeneralProcessingException();

            // retrieve data to list
            var resultData = record.SelectMany(r => r.Details)
              .Where(d => d.VerificationCode == VerificationCodeTypes.Verified)
              .GroupBy(d => d.Type)
              .Select(d => new ReactionCountRecord {
                Type = Char.ToLowerInvariant(d.Key.ToString()[0])
                    + d.Key.ToString().Substring(1),
                Count = d.Count()
              });

            if (!string.IsNullOrEmpty(requestParameter.Type))
                resultData = resultData.Where(r => string.Equals(r.Type.ToString(),
                  requestParameter.Type.Trim(),
                  StringComparison.OrdinalIgnoreCase));

            return resultData;
        }

        public async Task<ReactionEntity?> GetByContentIdAsync(string contentId)
        {
          return await GetQueryable(false)
            .FirstOrDefaultAsync(r => r.ContentId == contentId);
        }

        public async Task<bool> UserHasReactedAsync(string contentId)
        {
          return await GetQueryable(false)
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
          {
            DbContext.Entry(detail).State = EntityState.Modified;
          }
        }

        protected override async Task InnerDeleteAsync(ReactionEntity entity,
          CancellationToken cancellationToken = default)
        {
          foreach (ReactionDetailEntity detail in entity.Details)
          {
            DbContext.Entry(detail).State = EntityState.Modified;
            detail.VerificationCode = VerificationCodeTypes.Removed;
          }
        }

        private Result FilterByColumn(ref IQueryable<ReactionEntity> reactions,
          string? contentId,
          string? type)
        {
            if (!reactions.Any())
                return Result.Success();

            var predicate = GetBaseFilter();
            if (!string.IsNullOrEmpty(contentId) ||
              !string.IsNullOrEmpty(type))
            {
              if (!string.IsNullOrEmpty(contentId))
                  predicate = predicate.And(p =>
                    string.Equals(p.ContentId,
                      contentId.Trim(),
                      StringComparison.OrdinalIgnoreCase));

              if (!string.IsNullOrEmpty(type))
                  predicate = predicate.And(r =>
                    r.Details.Any(d => string.Equals(d.Type.ToString(),
                      type.Trim(),
                      StringComparison.OrdinalIgnoreCase)));
            }

            reactions = reactions.Where(predicate);

            return Result.Success();
        }
  }
}
