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

    public const int InvalidEmailFormat = 3;

		#endregion Constants

		#endregion Public

		#region Protected

		#region Properties

		protected override string MessageType
		{
			get { return "Validation"; }
		}

		#endregion Properties

		#endregion Protected
	}
}



