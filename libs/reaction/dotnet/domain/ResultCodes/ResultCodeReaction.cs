using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Reaction.Domain.ResultCodes
{
    /// <summary>
    /// Summary description for ResultCodeReaction.
    /// </summary>
    [Serializable]
    public class ResultCodeReaction : ResultCode
    {
		#region Public

		#region Constants

        public const int ReactionsAreDisabled = 1;

        public const int NoReactionsExist = 2;

        public const int ReactionAlreadyExists = 3;

		#endregion Constants

		#endregion Public

		#region Protected

		#region Properties

        protected override string MessageType
        {
            get { return "Reaction"; }
        }

		#endregion Properties

		#endregion Protected
    }
}
