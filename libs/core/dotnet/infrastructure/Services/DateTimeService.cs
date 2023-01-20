using OpenSystem.Core.DotNet.Application.Interfaces;
using System;

namespace OpenSystem.Core.DotNet.Infrastructure.Services
{
    public class DateTimeService : IDateTimeService
    {
        public DateTime NowUtc => DateTime.UtcNow;
    }
}
