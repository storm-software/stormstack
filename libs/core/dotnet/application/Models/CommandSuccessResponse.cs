using System.Collections.Generic;

namespace OpenSystem.Core.Application.Models
{
    public class CommandSuccessResponse
    {
        public Guid Id { get; set; }

        public CommandSuccessResponse(Guid id)
        {
          Id = id;
        }
    }
}
