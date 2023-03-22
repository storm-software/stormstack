using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Core.Domain.ResultCodes
{
	/// <summary>
	/// Summary description for ResultCodeApplication.
	/// </summary>
	[Serializable]
	public class ResultCodeGeneral : ResultCode
	{
		#region Public

		#region Constants

    public const int NoErrorOccurred = 0;

		public const int GeneralError = 1;

		#endregion Constants

		#endregion Public

		#region Protected

		#region Properties

		protected override string MessageType
		{
			get { return MessageTypes.General.ToString(); }
		}

		#endregion Properties

		#endregion Protected
	}
}



