using OpenSystem.Contact.Application.Queries.GetContacts;
using OpenSystem.Core.Application.Models;
using OpenSystem.Contact.Application.Interfaces;
using OpenSystem.Contact.Domain.Entities;
using OpenSystem.Contact.Domain.Enums;
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
using OpenSystem.Contact.Application.Models;

namespace OpenSystem.Contact.Infrastructure.Persistence
{
    public class ContactRepository : GenericRepository<ContactEntity>, IContactRepository
    {
        private readonly DbSet<ContactEntity> _contacts;

        public ContactRepository(ContactApplicationDbContext dbContext)
            : base(dbContext)
        {
            _contacts = dbContext.Set<ContactEntity>();
        }

        public async Task<bool> IsUniqueEmailAsync(string email)
        {
            return await _contacts
                .AllAsync(p => p.Email != email);
        }

        public async Task<(IEnumerable<ContactEntity> Data,
          RecordsCount RecordsCount)> GetContactsAsync(GetContactsQuery requestParameter)
        {
            var email = requestParameter.Email;
            var firstName = requestParameter.FirstName;
            var lastName = requestParameter.LastName;

            var pageNumber = requestParameter.PageNumber;
            var pageSize = requestParameter.PageSize;
            var orderBy = requestParameter.OrderBy;

            int recordsTotal, recordsFiltered;

            // Setup IQueryable
            var record = _contacts
                .AsNoTracking()
                .AsExpandable();

            // Count records total
            recordsTotal = await record.CountAsync();

            // filter data
            Result ret = FilterByColumn(ref record,
              email,
              firstName,
              lastName);
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
            /*var shapeData = _dataShaper.ShapeData(resultData,
              fields);*/

            return (resultData, recordsCount);
        }

        private Result FilterByColumn(ref IQueryable<ContactEntity> contacts,
          string? email,
          string? firstName,
          string? lastName)
        {
            if (!contacts.Any())
                return Result.Success();

            if (string.IsNullOrEmpty(email) &&
              string.IsNullOrEmpty(firstName) &&
              string.IsNullOrEmpty(lastName))
                return Result.Success();

            var predicate = PredicateBuilder.New<ContactEntity>();
            if (!string.IsNullOrEmpty(email))
                predicate = predicate.Or(p =>
                  p.Email.Contains(email.Trim()));

            if (!string.IsNullOrEmpty(firstName))
                predicate = predicate.Or(p =>
                  !string.IsNullOrEmpty(p.FirstName) &&
                    p.FirstName.Contains(firstName.Trim()));

            if (!string.IsNullOrEmpty(lastName))
                predicate = predicate.Or(p =>
                  !string.IsNullOrEmpty(p.LastName) &&
                    p.LastName.Contains(lastName.Trim()));

            contacts = contacts.Where(predicate);

            return Result.Success();
        }
  }
}
