using System;

namespace OpenSystem.Core.DotNet.Application.Interfaces
{
    public interface IDateTimeService
    {
        DateTime NowUtc { get; }
    }
}
