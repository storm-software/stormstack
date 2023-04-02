using System.Security.Cryptography;
using System.Text;

namespace OpenSystem.Core.Domain.Utilities
{
    /// <summary>
    /// Used to generate Ids.
    /// </summary>
    public static class GuidUtility
    {
        public static class Basic
        {
            private static readonly RandomNumberGenerator RandomNumberGenerator =
                RandomNumberGenerator.Create();

            /// <summary>
            /// Creates a new <see cref="Guid"/>.
            /// </summary>
            public static Guid CreateGuid()
            {
                return Guid.NewGuid();
            }

            /// <summary>
            /// Creates a new Sequential <see cref="Guid"/>.
            /// </summary>
            public static Guid CreateSequentialGuid()
            {
                // We start with 16 bytes of cryptographically strong random data.
                var randomBytes = new byte[10];
                RandomNumberGenerator.GetBytes(randomBytes);

                // An alternate method: use a normally-created GUID to get our initial
                // random data:
                // byte[] randomBytes = Guid.NewGuid().ToByteArray();
                // This is faster than using RNGCryptoServiceProvider, but I don't
                // recommend it because the .NET Framework makes no guarantee of the
                // randomness of GUID data, and future versions (or different
                // implementations like Mono) might use a different method.

                // Now we have the random basis for our GUID.  Next, we need to
                // create the six-byte block which will be our timestamp.

                // We start with the number of milliseconds that have elapsed since
                // DateTime.MinValue.  This will form the timestamp.  There's no use
                // being more specific than milliseconds, since DateTime.Now has
                // limited resolution.

                // Using millisecond resolution for our 48-bit timestamp gives us
                // about 5900 years before the timestamp overflows and cycles.
                // Hopefully this should be sufficient for most purposes. :)
                long timestamp = DateTime.UtcNow.Ticks / 10000L;

                // Then get the bytes
                byte[] timestampBytes = BitConverter.GetBytes(timestamp);

                // Since we're converting from an Int64, we have to reverse on
                // little-endian systems.
                if (BitConverter.IsLittleEndian)
                {
                    Array.Reverse(timestampBytes);
                }

                byte[] guidBytes = new byte[16];

                // For string and byte-array version, we copy the timestamp first, followed
                // by the random data.
                Buffer.BlockCopy(timestampBytes, 2, guidBytes, 0, 6);
                Buffer.BlockCopy(randomBytes, 0, guidBytes, 6, 10);

                // If formatting as a string, we have to compensate for the fact
                // that .NET regards the Data1 and Data2 block as an Int32 and an Int16,
                // respectively.  That means that it switches the order on little-endian
                // systems.  So again, we have to reverse.
                if (BitConverter.IsLittleEndian)
                {
                    Array.Reverse(guidBytes, 0, 4);
                    Array.Reverse(guidBytes, 4, 2);
                }

                return new Guid(guidBytes);
            }
        }

        public static class Comb
        {
            private static int _counter;

            private static long GetTicks()
            {
                var i = Interlocked.Increment(ref _counter);
                return DateTime.UtcNow.Ticks + i;
            }

            /// <summary>
            /// Generates a GUID values that causes less index fragmentation when stored
            /// in e.g. <c>uniqueidentifier</c> columns in MSSQL.
            /// </summary>
            /// <example>
            /// 2825c1d8-4587-cc55-08c1-08d6bde2765b
            /// 901337ba-c64b-c6d4-08c2-08d6bde2765b
            /// 45d57ba2-acc5-ce80-08c3-08d6bde2765b
            /// 36528acf-352a-c28c-08c4-08d6bde2765b
            /// 6fc88b5e-3782-c8fd-08c5-08d6bde2765b
            /// </example>
            public static Guid CreateGuid()
            {
                var uid = Guid.NewGuid().ToByteArray();
                var binDate = BitConverter.GetBytes(GetTicks());

                return new Guid(
                    new[]
                    {
                        uid[0],
                        uid[1],
                        uid[2],
                        uid[3],
                        uid[4],
                        uid[5],
                        uid[6],
                        (byte)(0xc0 | (0xf & uid[7])),
                        binDate[1],
                        binDate[0],
                        binDate[7],
                        binDate[6],
                        binDate[5],
                        binDate[4],
                        binDate[3],
                        binDate[2]
                    }
                );
            }

            /// <summary>
            /// Generates a GUID values that causes less index fragmentation when stored
            /// in e.g. <c>nvarchar(n)</c> columns in MSSQL.
            /// </summary>
            /// <example>
            /// 899ee1b9-bde2-08d6-20d8-b7e20375c7c9
            /// 899f09b9-bde2-08d6-fd1c-5ec8f3349bcf
            /// 899f09ba-bde2-08d6-1521-51d781607ac4
            /// 899f09bb-bde2-08d6-7e6a-fe84f5237dc4
            /// 899f09bc-bde2-08d6-c2f0-276123e06fcf
            /// </example>
            public static Guid CreateForString()
            {
                /*
                    From: https://docs.microsoft.com/en-us/dotnet/api/system.guid.tobytearray
                    Note that the order of bytes in the returned byte array is different from the string
                    representation of a Guid value. The order of the beginning four-byte group and the
                    next two two-byte groups is reversed, whereas the order of the last two-byte group
                    and the closing six-byte group is the same.
                */

                var uid = Guid.NewGuid().ToByteArray();
                var binDate = BitConverter.GetBytes(GetTicks());

                return new Guid(
                    new[]
                    {
                        binDate[0],
                        binDate[1],
                        binDate[2],
                        binDate[3],
                        binDate[4],
                        binDate[5],
                        binDate[6],
                        binDate[7],
                        uid[0],
                        uid[1],
                        uid[2],
                        uid[3],
                        uid[4],
                        uid[5],
                        uid[6],
                        (byte)(0xc0 | (0xf & uid[7])),
                    }
                );
            }
        }

        /// <summary>
        /// Creates a name-based UUID using the algorithm from RFC 4122 §4.3.
        /// http://code.logos.com/blog/2011/04/generating_a_deterministic_guid.html
        /// </summary>
        public static class Deterministic
        {
            // It is safe to not clean up since span-based TryComputeHash rents an array and releases it every time
            private static readonly SHA1 Algorithm = SHA1.Create();

            public static class Namespaces
            {
                public static readonly Guid Events = Guid.Parse(
                    "826a5a8c-6052-4737-a539-a03581d8120d"
                );
                public static readonly Guid Commands = Guid.Parse(
                    "d1b20b3e-decd-4350-a4c6-bbc26914eb58"
                );
                public static readonly Guid Aggregates = Guid.Parse(
                    "409ddb18-b5b2-47db-8127-50f3f846f6b0"
                );
            }

            // Modified from original
            // https://github.com/LogosBible/Logos.Utility/blob/master/src/Logos.Utility/GuidUtility.cs
            //
            // Copyright 2007-2013 Logos Bible Software
            //
            // Permission is hereby granted, free of charge, to any person obtaining a copy of
            // this software and associated documentation files(the "Software"), to deal in
            // the Software without restriction, including without limitation the rights to
            // use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
            // of the Software, and to permit persons to whom the Software is furnished to do
            // so, subject to the following conditions:
            //
            // The above copyright notice and this permission notice shall be included in all
            // copies or substantial portions of the Software.
            //
            // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
            // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
            // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
            // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
            // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            // SOFTWARE.

            public static Guid CreateGuid(Guid namespaceId, string name)
            {
                if (string.IsNullOrEmpty(name))
                    throw new ArgumentNullException(nameof(name));

                // Convert the name to a sequence of octets (as defined by the standard or conventions of its namespace) (step 3)
                // ASSUME: UTF-8 encoding is always appropriate
                var charSpan = name.AsSpan();
                Span<byte> byteSpan = stackalloc byte[Encoding.UTF8.GetByteCount(charSpan)];
                var sizeOf = Encoding.UTF8.GetBytes(charSpan, byteSpan);

                return CreateGuid(namespaceId, byteSpan.Slice(0, sizeOf));
            }

            public static Guid CreateGuid(Guid namespaceId, byte[] nameBytes)
            {
                return CreateGuid(namespaceId, nameBytes.AsSpan());
            }

            public static Guid CreateGuid(Guid namespaceId, Span<byte> nameSpan)
            {
                // Always use version 5 (version 3 is MD5, version 5 is SHA1)
                const int version = 5;

                if (namespaceId == default)
                    throw new ArgumentNullException(nameof(namespaceId));
                if (nameSpan.Length == 0)
                    throw new ArgumentNullException(nameof(nameSpan));

                // Convert the namespace UUID to network order (step 3)
                Span<byte> namespaceSpan = stackalloc byte[16]; // Guid length is 16.
                if (!namespaceId.TryWriteBytes(namespaceSpan))
                {
                    throw new ApplicationException("Failed to copy namespaceId to a span"); // Should never happen
                }
                SwapByteOrder(namespaceSpan);

                // Compute the hash of the name space ID concatenated with the name (step 4)
                Span<byte> hash = stackalloc byte[20]; // SHA1 produces 160-bit hash.
                Span<byte> combinedSpan = stackalloc byte[namespaceSpan.Length + nameSpan.Length];
                namespaceSpan.CopyTo(combinedSpan);
                nameSpan.CopyTo(combinedSpan.Slice(namespaceSpan.Length));

                lock (Algorithm) // We have to lock a shared instance since it is stateful
                {
                    if (!Algorithm.TryComputeHash(combinedSpan, hash, out _))
                    {
                        throw new ApplicationException("Failed to compute hash"); // Should never happen
                    }
                }

                // Most bytes from the hash are copied straight to the bytes of the new
                // GUID (steps 5-7, 9, 11-12)
                Span<byte> newGuid = stackalloc byte[16];
                hash.Slice(0, 16).CopyTo(newGuid);

                // Set the four most significant bits (bits 12 through 15) of the time_hi_and_version
                // field to the appropriate 4-bit version number from Section 4.1.3 (step 8)
                newGuid[6] = (byte)((newGuid[6] & 0x0F) | (version << 4));

                // Set the two most significant bits (bits 6 and 7) of the clock_seq_hi_and_reserved
                // to zero and one, respectively (step 10)
                newGuid[8] = (byte)((newGuid[8] & 0x3F) | 0x80);

                // Convert the resulting UUID to local byte order (step 13)
                SwapByteOrder(newGuid);
                return new Guid(newGuid);
            }

            internal static void SwapByteOrder(Span<byte> guid)
            {
                SwapBytes(guid, 0, 3);
                SwapBytes(guid, 1, 2);
                SwapBytes(guid, 4, 5);
                SwapBytes(guid, 6, 7);
            }

            internal static void SwapBytes(Span<byte> guid, int left, int right)
            {
                var temp = guid[left];
                guid[left] = guid[right];
                guid[right] = temp;
            }
        }
    }
}
