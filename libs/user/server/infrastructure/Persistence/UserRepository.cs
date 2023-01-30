using OpenSystem.User.Application.Queries.GetUsers;
using OpenSystem.Core.DotNet.Application.Models;
using OpenSystem.User.Application.Interfaces;
using OpenSystem.User.Domain.Entities;
using OpenSystem.User.Domain.Enums;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using OpenSystem.Core.DotNet.Infrastructure.Persistence;
using OpenSystem.Core.DotNet.Application.Models.Parameters;
using OpenSystem.Core.DotNet.Domain.ResultCodes;
using OpenSystem.Core.DotNet.Domain.Exceptions;
using OpenSystem.Core.DotNet.Application.Interfaces;
using OpenSystem.Core.DotNet.Domain.Entities;

namespace OpenSystem.User.Infrastructure.Persistence
{
    public class UserRepository : GenericRepository<UserEntity>, IUserRepository
    {
        private readonly DbSet<UserEntity> _userAccounts;

        private IDataShapeHelper<UserEntity> _dataShaper;


        public UserRepository(ApplicationDbContext dbContext,
            IDataShapeHelper<UserEntity> dataShaper)
            : base(dbContext)
        {
            _userAccounts = dbContext.Set<UserEntity>();
            _dataShaper = dataShaper;
        }

        public async Task<bool> IsUniqueUserIdAsync(string userId)
        {
            return await _userAccounts
                .AllAsync(p => p.UserId != userId);
        }

        public async Task<(IEnumerable<Entity> data,
          RecordsCount recordsCount)> GetUsersAsync(GetUsersQuery requestParameter)
        {
            var userId = requestParameter.UserId;
            var userType = requestParameter.UserType;
            var userStatusType = requestParameter.UserStatusType;

            var pageNumber = requestParameter.PageNumber;
            var pageSize = requestParameter.PageSize;
            var orderBy = requestParameter.OrderBy;
            var fields = requestParameter.Fields;

            int recordsTotal, recordsFiltered;

            // Setup IQueryable
            var record = _userAccounts
                .AsNoTracking()
                .AsExpandable();

            // Count records total
            recordsTotal = await record.CountAsync();

            // filter data
            Result ret = FilterByColumn(ref record,
              userId,
              userType,
              userStatusType);
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

            // select columns
            if (!string.IsNullOrWhiteSpace(fields))
            {
                record = record.Select<UserEntity>("new(" + fields + ")");
            }

            // paging
            record = record
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize);

            // retrieve data to list
            var resultData = await record.ToListAsync();
            var shapeData = _dataShaper.ShapeData(resultData,
              fields);

            return (shapeData, recordsCount);
        }

        private Result FilterByColumn(ref IQueryable<UserEntity> userAccounts,
          string? userId,
          UserTypes? userType,
          UserStatusTypes? userStatusType)
        {
            if (!userAccounts.Any())
                return Result.Success();

            if (string.IsNullOrEmpty(userId) &&
                 userType == null &&
                userStatusType == null)
                return Result.Success();

            var predicate = PredicateBuilder.New<UserEntity>();

            if (!string.IsNullOrEmpty(userId))
                predicate = predicate.Or(p =>
                  p.UserId.Contains(userId.Trim()));

            if (userType != null)
                predicate = predicate.Or(p =>
                  p.Type == userType);

            if (userStatusType != null)
                predicate = predicate.Or(p =>
                  p.Status == userStatusType);

            userAccounts = userAccounts.Where(predicate);

            return Result.Success();
        }
  }
}
