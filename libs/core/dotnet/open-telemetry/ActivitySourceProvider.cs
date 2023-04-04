using System.Diagnostics;

namespace OpenSystem.Core.OpenTelemetry
{
    public static class ActivitySourceProvider
    {
        public const string DefaultSourceName = "pat-sullivan.com";

        public static readonly ActivitySource Instance = new(DefaultSourceName, "v1");

        public static ActivityListener AddDummyListener(
            ActivitySamplingResult samplingResult = ActivitySamplingResult.AllDataAndRecorded
        )
        {
            var listener = new ActivityListener
            {
                ShouldListenTo = _ => true,
                Sample = (ref ActivityCreationOptions<ActivityContext> _) => samplingResult
            };

            ActivitySource.AddActivityListener(listener);

            return listener;
        }
    }
}
