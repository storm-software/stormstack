namespace OpenSystem.Core.DotNet.Domain.ResultCodes
{
	/// <summary>
	/// Summary description for ResultCodeShared.
	/// </summary>
	[Serializable]
	public class ResultCodeShared : ResultCode
	{
		#region Public

		#region Constants

		public const int InvalidEmailFormat = 1;

		#endregion Constants

		#endregion Public

		#region Protected

		#region Properties

		protected override string MessageType
		{
			get { return "Shared"; }
		}

		#endregion Properties

		#endregion Protected
	}
}



