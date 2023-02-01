using OpenSystem.Core.Application.Models.DTOs;
using System.Threading.Tasks;

namespace OpenSystem.Core.Application.Interfaces
{
    public interface IEmailService
    {
        Task SendAsync(EmailRequest request);
    }
}
