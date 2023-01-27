namespace OpenSystem.Core.DotNet.Domain.ResultCodes
{
	/// <summary>
	/// Summary description for ResultCodeDatabase.
	/// </summary>
	[Serializable]
	public class ResultCodeDatabase : ResultCode
	{
		#region Public

		#region Constants

		public const int ConnectionFailure = 1;

		#endregion Constants

		#endregion Public

		#region Protected

		#region Properties

		protected override string MessageType
		{
			get { return "Database"; }
		}

		#endregion Properties

		#endregion Protected
	}
}



