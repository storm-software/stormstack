using OpenSystem.Core.DotNet.Application.DTOs;
using System.Threading.Tasks;

namespace OpenSystem.Core.DotNet.Application.Interfaces
{
    public interface IEmailService
    {
        Task SendAsync(EmailRequest request);
    }
}
