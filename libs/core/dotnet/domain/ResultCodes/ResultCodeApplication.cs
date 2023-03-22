using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Core.Domain.ResultCodes
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

    public const int FileExportFailure = 2;

    public const int NoResultsFound = 3;

    public const int MissingSetting = 4;

    public const int StartupFailure = 5;

    public const int MissingMediator = 6;

    public const int FailedConvertingToEntity = 7;

    public const int RecordNotFound = 8;

    public const int FailedFormattingResponse = 9;

    public const int InvalidRequestSentToServer = 10;

		#endregion Constants

		#endregion Public

		#region Protected

		#region Properties

		protected override string MessageType
		{
			get { return MessageTypes.Application.ToString(); }
		}

		#endregion Properties

		#endregion Protected
	}
}



