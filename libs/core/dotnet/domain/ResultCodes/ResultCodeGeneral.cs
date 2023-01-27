namespace OpenSystem.Core.DotNet.Domain.ResultCodes
{
	/// <summary>
	/// Summary description for ResultCodeApplication.
	/// </summary>
	[Serializable]
	public class ResultCodeGeneral : ResultCode
	{
		#region Public

		#region Constants

		public const int GeneralError = 1;

		#endregion Constants

		#endregion Public

		#region Protected

		#region Properties

		protected override string MessageType
		{
			get { return "General"; }
		}

		#endregion Properties

		#endregion Protected
	}
}



