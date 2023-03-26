using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Exceptions
{
  public class MissingSettingException : BaseException
  {
    public string? MissingSettingName {get; set;}

    public MissingSettingException(string missingSettingName)
      : base(typeof(ResultCodeApplication),
        ResultCodeApplication.MissingSetting,
        $"{missingSettingName} is not defined in the application's settings")
    {
      MissingSettingName = missingSettingName;
    }
  }
}
