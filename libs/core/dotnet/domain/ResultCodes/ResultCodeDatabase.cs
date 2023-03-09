using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Core.Domain.ResultCodes
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

    public const int ConnectionStringNotSet = 2;

		#endregion Constants

		#endregion Public

		#region Protected

		#region Properties

		protected override string MessageType
		{
			get { return MessageTypes.Database.ToString(); }
		}

		#endregion Properties

		#endregion Protected
	}
}



