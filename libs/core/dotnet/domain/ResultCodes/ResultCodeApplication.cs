namespace OpenSystem.Core.DotNet.Domain.ResultCodes
{
	/// <summary>
	/// Summary description for ResultCodeApplication.
	/// </summary>
	[Serializable]
	public class ResultCodeApplication : ResultCode
	{
		#region Public

		#region Constants

		public const int FieldNotSet = 1;

		#endregion Constants

		#endregion Public

		#region Protected

		#region Properties

		protected override string MessageType
		{
			get { return "Application"; }
		}

		#endregion Properties

		#endregion Protected
	}
}



