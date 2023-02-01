namespace OpenSystem.Core.Domain.Settings
{
  public class ServiceDiscoverySettings
  {
    public string Id { get; set; }

		public string Name { get; set; }

    public string Address { get; set; }

		public Uri DiscoveryAddress { get; set; }

    public string[] Tags { get; set; }

		public string HealthCheckEndPoint { get; set; }

    public bool DisableAgentCheck { get; set; }
  }
}
