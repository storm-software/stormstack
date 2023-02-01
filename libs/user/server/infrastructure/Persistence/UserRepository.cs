using OpenSystem.User.Application.Queries.GetUsers;
using OpenSystem.Core.Application.Models;
using OpenSystem.User.Application.Interfaces;
using OpenSystem.User.Domain.Entities;
using OpenSystem.User.Domain.Enums;
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

namespace OpenSystem.User.Infrastructure.Persistence
{
    public class UserRepository : GenericRepository<UserEntity>, IUserRepository
    {
        private readonly DbSet<UserEntity> _userAccounts;

        public UserRepository(UserApplicationDbContext dbContext)
            : base(dbContext)
        {
            _userAccounts = dbContext.Set<UserEntity>();
        }

        public async Task<bool> IsUniqueUserIdAsync(Guid userId)
        {
            return await _userAccounts
                .AllAsync(p => p.Id != userId);
        }

        public async Task<(IEnumerable<UserEntity> data,
          RecordsCount recordsCount)> GetUsersAsync(GetUsersQuery requestParameter)
        {
            var userId = requestParameter.UserId;
            var email = requestParameter.Email;
            var userName = requestParameter.UserName;

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
              email,
              userName);
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
            /*var shapeData = _dataShaper.ShapeData(resultData,
              fields);*/

            return (resultData, recordsCount);
        }

        private Result FilterByColumn(ref IQueryable<UserEntity> userAccounts,
          Guid? userId,
          string? email,
          string? userName)
        {
            if (!userAccounts.Any())
                return Result.Success();

            if (userId == null)
                return Result.Success();

            var predicate = PredicateBuilder.New<UserEntity>();
            if (userId != null)
                predicate = predicate.Or(p =>
                  p.Id == userId);

            if (!string.IsNullOrEmpty(email))
                predicate = predicate.Or(p =>
                  p.NormalizedEmail.Contains(email.Trim()));

            if (!string.IsNullOrEmpty(userName))
                predicate = predicate.Or(p =>
                  p.NormalizedUserName.Contains(userName.Trim()));

            /*if (userType != null)
                predicate = predicate.Or(p =>
                  p.Type == userType);

            if (userStatusType != null)
                predicate = predicate.Or(p =>
                  p.Status == userStatusType);*/

            userAccounts = userAccounts.Where(predicate);

            return Result.Success();
        }
  }
}
