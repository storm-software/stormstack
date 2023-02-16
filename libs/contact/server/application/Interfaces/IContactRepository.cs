using OpenSystem.Core.Application.Models;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Contact.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using OpenSystem.Contact.Application.Queries.GetContacts;
using OpenSystem.Core.Application.Models.Parameters;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Contact.Application.Models;

namespace OpenSystem.Contact.Application.Interfaces
{
    public interface IContactRepository : IGenericRepository<ContactEntity>
    {
        Task<bool> IsUniqueEmailAsync(string email);

        Task<(IEnumerable<ContactEntity> Data,
          RecordsCount RecordsCount)> GetContactsAsync(GetContactsQuery requestParameters);
    }
}
