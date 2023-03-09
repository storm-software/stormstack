namespace OpenSystem.Core.Domain.Settings
{
  public abstract class FileServiceSettings
  {
    public string FilePath { get; set; }

    public string FileName { get; set; }

    public virtual string FileExtension { get; set; }
  }
}
