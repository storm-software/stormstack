using OpenSystem.Core.Domain.Constants;
using OpenSystem.Core.Domain.Extensions;

namespace OpenSystem.Core.Domain.ResultCodes
{
    /// <summary>
    /// The base class for all ResultCodes classes.
    /// </summary>
    [Serializable]
    public abstract class ResultCode
    {
		#region Public

		#region Static

        /// <summary>
        /// Scan fields, look for matching ResultCode, return.
        /// </summary>
        /// <param name="strCode"></param>
        /// <returns></returns>
        public static ResultCode? Parse(string strCode)
        {
            try
            {
                if (strCode == null || strCode.Length == 0)
                    return null;

                string[] astrCode = strCode.Split(Literals.FieldSeparator.ToCharArray());
                if (astrCode == null || astrCode.Length < 3)
                    return null;

                return Activator.CreateInstance(astrCode[1], astrCode[2])?.Unwrap() as ResultCode;
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Overridden to return the Name
        /// property as string representation.
        /// </summary>
        /// <returns></returns>
        public static string Serialize(Type resultCodeType, int code)
        {
            return string.Format(
                "{0}{1}{2}",
                resultCodeType?.PrettyPrint(),
                Literals.FieldSeparator,
                code
            );
        }

        /// <summary>
        /// Overridden to return the Name
        /// property as string representation.
        /// </summary>
        /// <returns></returns>
        public static string Serialize(string resultCodeType, int code)
        {
            return string.Format("{0}{1}{2}", resultCodeType, Literals.FieldSeparator, code);
        }

		#endregion Static

		#region Methods

        /// <summary>
        /// Overridden to return the Name
        /// property as string representation.
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            return MessageType.ToUpper();
        }

        /// <summary>
        /// Overridden to return the Name
        /// property as string representation.
        /// </summary>
        /// <returns></returns>
        public string Serialize()
        {
            return string.Format(
                "{0}{1}{2}{1}{3}",
                MessageType.ToUpper().ToString(),
                Literals.FieldSeparator,
                GetType().Assembly.FullName,
                GetType().FullName
            );
        }

        /// <summary>
        /// Overridden to return the Name
        /// property as string representation.
        /// </summary>
        /// <returns></returns>
        public string Serialize(int? code)
        {
            return string.Format(
                "{0}{1}{2}{1}{3}{1}{4}",
                MessageType.ToUpper().ToString(),
                Literals.FieldSeparator,
                GetType().Assembly.FullName,
                GetType().FullName,
                code
            );
        }

		#endregion Methods

		#endregion Public

		#region Protected

		#region Properties

        /// <summary>
        /// Defines the message type of the ResultCode
        /// used in looking up messages
        /// </summary>
        protected abstract string MessageType { get; }

		#endregion Properties

		#endregion Protected
    }
}
