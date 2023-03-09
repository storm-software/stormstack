using OpenSystem.Core.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Core.Domain.ValueObjects;
using System.Globalization;
using System.ComponentModel.DataAnnotations;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Extensions;

namespace OpenSystem.Core.Domain.Entities
{
    public class MessageEntity
      : AuditableEntity<Guid>, IAggregateRoot
    {
      public CultureInfo? CultureId { get; set; }

      public string? Type { get; set; }

      public int? Code { get; set; }

      public string? Message { get; set; }

      /// <summary>
      /// Allow derived class to add validations
      /// </summary>
      protected override Result InnerValidate(ValidationContext validationContext)
      {
        if (!string.IsNullOrEmpty(Type) ||
          !Code.IsSet() ||
          CultureId == null)
        {
          return Result.Failure(typeof(ResultCodeValidation),
            ResultCodeValidation.IdentifierCannotBeNull);
        }

        return Result.Success();
      }
    }
}
