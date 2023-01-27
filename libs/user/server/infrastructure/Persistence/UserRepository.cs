using OpenSystem.User.Application.Queries.GetUsers;
using OpenSystem.Core.DotNet.Application.Models;
using OpenSystem.User.Application.Interfaces;
using OpenSystem.User.Application.Interfaces.Repositories;
using OpenSystem.User.Application.Parameters;
using OpenSystem.User.Domain.Entities;
using OpenSystem.User.Domain.Enums;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace OpenSystem.User.Infrastructure.Persistence
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        private readonly DbSet<User> _users;

        private IDataShapeHelper<User> _dataShaper;


        public PositionRepositoryAsync(ApplicationDbContext dbContext,
            IDataShapeHelper<User> dataShaper)
            : base(dbContext)
        {
            _users = dbContext.Set<User>();
            _dataShaper = dataShaper;
        }

        public async Task<bool> IsUniqueAsync(string userId)
        {
            return await _users
                .AllAsync(p => p.UserId != userId);
        }

        public async Task<(IEnumerable<Entity> data, RecordsCount recordsCount)> GetUsersAsync(GetUsersQuery requestParameter)
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
            var record = _users
                .AsNoTracking()
                .AsExpandable();

            // Count records total
            recordsTotal = await record.CountAsync();

            // filter data
            Result ret = FilterByColumn(ref record,
              userId,
              userType,
              userStatusType);
            if (ret.Failed())
              return ret;

            // Count records after filter
            recordsFiltered = await record.CountAsync();

            //set Record counts
            var recordsCount = new RecordsCount
            {
                RecordsFiltered = recordsFiltered,
                RecordsTotal = recordsTotal
            };

            // set order by
            if (!string.IsNullOrWhiteSpace(orderBy))
            {
                record = record.OrderBy(orderBy);
            }

            // select columns
            if (!string.IsNullOrWhiteSpace(fields))
            {
                record = record.Select<User>("new(" + fields + ")");
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

        private Result FilterByColumn(ref IQueryable<User> users,
          string? userId,
          UserType? userType,
          UserStatusTypes? userStatusType)
        {
            if (!users.Any())
                return Result.Success();

            if (string.IsNullOrEmpty(userId) &&
                 userType == null &&
                userStatusType == null)
                return Result.Success();

            var predicate = PredicateBuilder.New<User>();

            if (!string.IsNullOrEmpty(userId))
                predicate = predicate.Or(p =>
                  p.UserId.Contains(userId.Trim()));

            if (userType != null)
                predicate = predicate.Or(p =>
                  p.UserType.Contains(userType.ToString()));

            if (userStatusType != null)
                predicate = predicate.Or(p =>
                  p.UserStatusType.Contains(userStatusType.ToString()));

            users = users.Where(predicate);

            return Result.Success();
        }
    }
}
