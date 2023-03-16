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
using OpenSystem.Core.Application.Services;

namespace OpenSystem.Reaction.Infrastructure.Persistence
{
    public class ReactionRepository
      : BaseRepository<ReactionEntity>, IReactionRepository
    {
        private readonly DbSet<ReactionEntity> _reactions;

        private readonly DbSet<ReactionDetailEntity> _reactionDetails;

        private readonly ICurrentUserService _currentUserService;

        public ReactionRepository(ReactionDbContext dbContext,
          AutoMapper.IMapper mapper,
          ICurrentUserService currentUserService,
          ILogger logger)
            : base(dbContext,
              mapper)
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
                record = record.OrderBy(orderBy);

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

            var resultData = await record.ToListAsync();

            // retrieve data to list
            var data = resultData.SelectMany(r => r.Details)
              .GroupBy(d => d.Type)
              .Select(d => new ReactionCountRecord {
                Type = d.Key.ToString(),
                Count = d.Count()
              });

            if (!string.IsNullOrEmpty(requestParameter.Type))
                data = data.Where(r => r.Type.ToUpper() == requestParameter.Type.Trim().ToUpper());

            return data;
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
              r.Details.Any(d => !string.IsNullOrEmpty(_currentUserService.UserId) &&
                  _currentUserService.UserId.ToUpper() == d.UserId.ToUpper()));
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

          /*foreach (ReactionDetailEntity detail in entity.Details)
          {
            if (entity.)
              _reactionDetails.Remove(detail);
          }*/
        }

        protected override async Task InnerDeleteAsync(ReactionEntity entity,
          CancellationToken cancellationToken = default)
        {
          foreach (ReactionDetailEntity detail in entity.Details)
            _reactionDetails.Remove(detail);

        }

        private Result FilterByColumn(ref IQueryable<ReactionEntity> reactions,
          string? contentId,
          string? type)
        {
            if (!reactions.Any())
                return Result.Success();

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

            return Result.Success();
        }
  }
}
