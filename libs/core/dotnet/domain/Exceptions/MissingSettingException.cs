using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Exceptions
{
    public class MissingSettingException : BaseException
    {
      public string? MissingSettingName {get; set;}

      public MissingSettingException()
        : base(typeof(ResultCodeApplication),
          ResultCodeApplication.MissingSetting)
      {
      }

      public MissingSettingException(string missingSettingName)
        : base(typeof(ResultCodeApplication),
          ResultCodeApplication.MissingSetting)
      {
        MissingSettingName = missingSettingName;
      }

      public MissingSettingException(Type? resultCodeType,
        int code)
        : base((resultCodeType == null
          ? typeof(ResultCodeApplication)
          : resultCodeType),
            (!code.IsSet()
          ? ResultCodeApplication.MissingSetting
          : code))
      {
      }

      public MissingSettingException(string missingSettingName,
        Type? resultCodeType,
        int code)
        : base((resultCodeType == null
          ? typeof(ResultCodeApplication)
          : resultCodeType),
            (!code.IsSet()
          ? ResultCodeApplication.MissingSetting
          : code))
      {
        MissingSettingName = missingSettingName;
      }


      public MissingSettingException(Type? resultCodeType,
        int code,
        Exception exception)
          : base(resultCodeType,
              code,
              exception)
      {
      }

      public MissingSettingException(string missingSettingName,
        Type? resultCodeType,
        int code,
        Exception exception)
          : base(resultCodeType,
              code,
              exception)
      {
        MissingSettingName = missingSettingName;
      }

      public MissingSettingException(Exception exception)
          : base(typeof(ResultCodeApplication),
              ResultCodeApplication.MissingSetting,
              exception)
      {
      }
    }
}
