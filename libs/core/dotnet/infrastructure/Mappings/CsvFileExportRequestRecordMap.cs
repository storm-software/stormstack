using System.Globalization;
using OpenSystem.Core.Application.Models;
using CsvHelper.Configuration;

namespace OpenSystem.Core.Infrastructure.Mappings
{
  public class CsvFileExportRequestRecordMap : ClassMap<PagedResponse<object>>
  {
      public CsvFileExportRequestRecordMap()
      {
          AutoMap(CultureInfo.InvariantCulture);

          // Map(m => m.IsActive).Convert(c => c.IsActive ? "Yes" : "No");
      }
  }
}




