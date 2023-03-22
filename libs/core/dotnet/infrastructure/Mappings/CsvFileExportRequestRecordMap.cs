using System.Globalization;
using OpenSystem.Core.Domain.Common;
using CsvHelper.Configuration;

namespace OpenSystem.Core.Infrastructure.Mappings
{
  public class CsvFileExportRequestRecordMap : ClassMap<Paged<object>>
  {
      public CsvFileExportRequestRecordMap()
      {
          AutoMap(CultureInfo.InvariantCulture);

          // Map(m => m.IsActive).Convert(c => c.IsActive ? "Yes" : "No");
      }
  }
}




