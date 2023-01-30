using System.Globalization;
using OpenSystem.Core.DotNet.Application.Models;
using CsvHelper.Configuration;

namespace OpenSystem.Core.DotNet.Infrastructure.Mappings
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




