using OpenSystem.Core.Application.Models.DTOs;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Domain.Settings;
//using MailKit.Net.Smtp;
//using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
//using MimeKit;
using System.Threading.Tasks;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Infrastructure.Services
{
    /*  public class EmailService : IEmailService
      {
          public MailSettings _mailSettings { get; }
  
          public ILogger<EmailService> _logger { get; }
  
          public EmailService(IOptions<MailSettings> mailSettings,
            ILogger<EmailService> logger)
          {
              _mailSettings = mailSettings.Value;
              _logger = logger;
          }
  
          public async Task SendAsync(EmailRequest request)
          {
              try
              {
                  // create message
                  var email = new MimeMessage();
                  email.Sender = MailboxAddress.Parse(request.From
                    ?? _mailSettings.EmailFrom);
                  email.To.Add(MailboxAddress.Parse(request.To));
                  email.Subject = request.Subject;
  
                  var builder = new BodyBuilder();
                  builder.HtmlBody = request.Body;
                  email.Body = builder.ToMessageBody();
  
                  using var smtp = new SmtpClient();
                  smtp.Connect(_mailSettings.SmtpHost,
                    _mailSettings.SmtpPort,
                    SecureSocketOptions.StartTls);
  
                  smtp.Authenticate(_mailSettings.SmtpUser,
                    _mailSettings.SmtpPassword);
  
                  await smtp.SendAsync(email);
                  smtp.Disconnect(true);
              }
              catch (System.Exception ex)
              {
                  _logger.LogError(ex.Message,
                    ex);
                  throw new GeneralProcessingException(typeof(ResultCodeApplication),
                    ResultCodeApplication.EmailDeliveryFailure);
              }
          }
      }*/
}
