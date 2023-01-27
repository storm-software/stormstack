namespace OpenSystem.Core.DotNet.Domain.ResultCodes
{
	/// <summary>
	/// Summary description for ResultCodeValidation.
	/// </summary>
	[Serializable]
	public class ResultCodeValidation : ResultCode
	{
		#region Public

		#region Constants

		public const int IdentifierCannotBeNull = 1;

    public const int InvalidEmailFormat = 2;

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



