namespace OpenSystem.Core.DotNet.Domain.ResultCodes
{
	/// <summary>
	/// Summary description for ResultCodeSecurity.
	/// </summary>
	[Serializable]
	public class ResultCodeSecurity : ResultCode
	{
		#region Public

		#region Constants

		public const int InvalidPermissions = 1;

		#endregion Constants

		#endregion Public

		#region Protected

		#region Properties

		protected override string MessageType
		{
			get { return "Security"; }
		}

		#endregion Properties

		#endregion Protected
	}
}



