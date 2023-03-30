using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Core.Domain.ResultCodes
{
    /// <summary>
    /// Summary description for ResultCodeValidation.
    /// </summary>
    [Serializable]
    public class ResultCodeValidation : ResultCode
    {
		#region Public

		#region Constants

        public const int OneOrMoreValidationFailuresHaveOccurred = 1;

        public const int IdentifierCannotBeNull = 2;

        public const int RequiredFieldMissing = 3;

        public const int InvalidEmailFormat = 4;

        public const int EntityNotCreated = 5;

        public const int EntityAlreadyCreated = 6;

        public const int EntityAlreadyDeleted = 7;

        public const int EntityCannotBeUpdated = 8;

        public const int EntityCannotBeRestored = 9;

        public const int EntityIsNotActive = 10;

        public const int InvalidParameter = 11;

        public const int NumericValueMustBePositive = 12;

        public const int InvalidIdentifier = 13;

        public const int InvalidAggregateNameFormat = 14;

		#endregion Constants

		#endregion Public

		#region Protected

		#region Properties

        protected override string MessageType
        {
            get { return MessageTypes.Validation.ToString(); }
        }

		#endregion Properties

		#endregion Protected
    }
}
