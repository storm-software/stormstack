namespace OpenSystem.Core.DotNet.Domain.Enums
{
  /// <summary>
  /// Summary description for VerificationCodeTypes
	/// </summary>
	public enum VerificationCodeTypes
	{
		Verified									    = 100,
		Noticed										    = 200,
		Restricted									  = 300,
		Unverified									  = 500,
		PendingEventUnverified				= 600,
		Returned									    = 650,
		RestrictedUnverified		      = 700,
		Removed										    = 1000,
		RestrictedAwaitingRemoval		  = 1100,
    UnverifiedRemoved							= 1500,
		None										      = 10000,
		Rejected                      = 1200,
	}
}
