using System.Collections;

namespace OpenSystem.Core.Application.Models
{
    public class TypeObjectDictionary<TObject> : IDictionary<Type, TObject>
    {
        private KeyValuePair<Type, TObject>[] _storage = Array.Empty<KeyValuePair<Type, TObject>>();

        private int[] _hashes = Array.Empty<int>();

        private int IndexOf(Type key)
        {
            var hash = key.GetHashCode();
            return IndexOf(hash);
        }

        private int IndexOf(int hash)
        {
            if (_count == 0)
                return -1;
            var lo = 0;
            var hi = _count - 1;
            while (lo <= hi)
            {
                var mid = (hi + lo) / 2;
                var midHash = _hashes[mid];
                if (midHash == hash)
                    return mid;

                if (midHash < hash)
                {
                    lo = mid + 1;
                }
                else
                {
                    hi = mid - 1;
                }
            }

            return -1;
        }

        private int FindSpot(int hash)
        {
            if (_count == 0)
                return 0;
            var lo = 0;
            var hi = _hashes.Length - 1;
            while (lo <= hi)
            {
                var mid = (lo + hi) / 2;
                var midHash = _hashes[mid];

                if (midHash > hash)
                {
                    hi = mid - 1;
                }
                else
                {
                    lo = mid + 1;
                }
            }

            return lo;
        }

        private int _count;

        public bool TryAdd<T>(TObject value) => TryAdd(typeof(T), value);

        public bool TryAdd(KeyValuePair<Type, TObject> item)
        {
            var hash = item.Key.GetHashCode();
            if (IndexOf(hash) != -1)
                return false;
            var spot = FindSpot(hash);
            var length = _hashes.Length;
            if (length == _count)
                Expand();

            if (spot < length)
                AddSpaceAt(spot);

            return true;
        }

        public bool TryAdd(Type key, TObject value)
        {
            var hash = key.GetHashCode();
            var index = IndexOf(key);
            if (index != -1)
                return false;
            var length = _hashes.Length;

            var spot = FindSpot(hash);
            if (length == _count)
                Expand();

            if (spot < length)
                AddSpaceAt(spot);

            _hashes[spot] = hash;
            _storage[spot] = new KeyValuePair<Type, TObject>(key, value);

            _count++;
            return true;
        }

        private void AddSpaceAt(int index)
        {
            var target = index + 1;
            Array.Copy(_hashes, index, _hashes, target, _count - index);
            Array.Copy(_storage, index, _storage, target, _count - index);
        }

        private void RemoveAt(int index)
        {
            var source = index + 1;
            Array.Copy(_hashes, source, _hashes, index, _count - index);
            Array.Copy(_storage, source, _storage, index, _count - index);
            var newSize = _hashes.Length - 1;
            Array.Resize(ref _hashes, newSize);
            Array.Resize(ref _storage, newSize);
            _count--;
        }

        private void Expand()
        {
            var newSize = _count + 1;
            Array.Resize(ref _hashes, newSize);
            Array.Resize(ref _storage, newSize);
            // _hashes[_count] = int.MaxValue;
        }

        public Enumerator GetEnumerator() => new(this);

        IEnumerator<KeyValuePair<Type, TObject>> IEnumerable<
            KeyValuePair<Type, TObject>
        >.GetEnumerator() => GetEnumerator();

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public void Add(KeyValuePair<Type, TObject> item)
        {
            var (key, value) = item;
            if (!TryAdd(key, value))
            {
                throw new ArgumentException("Key already exists");
            }
        }

        public void Clear()
        {
            throw new NotImplementedException();
        }

        public bool Contains(KeyValuePair<Type, TObject> item)
        {
            var key = item.Key;
            var index = IndexOf(key);
            if (index == -1)
                return false;
            return _storage[index].Equals(item);
        }

        public void CopyTo(KeyValuePair<Type, TObject>[] array, int arrayIndex)
        {
            var count = _count - arrayIndex;
            for (int i = 0; i < count; i++)
            {
                var (key, value) = _storage[arrayIndex];
                array[i] = new KeyValuePair<Type, TObject>(key, value);
                arrayIndex++;
            }
        }

        public bool Remove(KeyValuePair<Type, TObject> item)
        {
            var key = item.Key;
            var index = IndexOf(key);
            if (index == -1)
                return false;
            if (!_storage[index].Equals(item))
                return false;
            RemoveAt(index);
            return true;
        }

        public int Count => _count;
        int ICollection<KeyValuePair<Type, TObject>>.Count => _count;

        public bool IsReadOnly { get; } = true;

        public void Add(Type key, TObject value)
        {
            if (!TryAdd(key, value))
            {
                throw new ArgumentException("Key already exists");
            }
        }

        public bool TryGetValue<T>(out TObject value) => TryGetValue(typeof(T), out value);

        public bool TryGetValue(Type key, out TObject value)
        {
            var index = IndexOf(key);
            if (index == -1)
            {
                value = default!;
                return false;
            }

            value = _storage[index].Value;
            return true;
        }

        public bool ContainsKey<T>() => ContainsKey(typeof(T));

        public bool ContainsKey(Type key) => IndexOf(key) != -1;

        bool IDictionary<Type, TObject>.ContainsKey(Type key) => ContainsKey(key);

        public bool Remove(Type key)
        {
            var index = IndexOf(key);
            if (index == -1)
                return false;
            RemoveAt(index);
            return true;
        }

        bool IDictionary<Type, TObject>.TryGetValue(Type key, out TObject value) =>
            TryGetValue(key, out value);

        public TObject this[Type key]
        {
            get =>
                TryGetValue(key, out var value)
                    ? value
                    : throw new ArgumentOutOfRangeException(nameof(key));
            set
            {
                var index = IndexOf(key);
                if (index == -1)
                {
                    TryAdd(key, value);
                }
                else
                {
                    _storage[index] = new KeyValuePair<Type, TObject>(key, value);
                }
            }
        }

        public TObject GetValue(Type type) => this[type];

        public TObject GetValue<T>() => this[typeof(T)];

        ICollection<Type> IDictionary<Type, TObject>.Keys
        {
            get
            {
                var keys = new Type[_count];
                for (int i = 0; i < _count; i++)
                {
                    keys[i] = _storage[i].Key;
                }

                return keys;
            }
        }

        ICollection<TObject> IDictionary<Type, TObject>.Values
        {
            get
            {
                var values = new TObject[_count];
                for (int i = 0; i < _count; i++)
                {
                    values[i] = _storage[i].Value;
                }

                return values;
            }
        }

        public struct Enumerator : IEnumerator<KeyValuePair<Type, TObject>>
        {
            private readonly TypeObjectDictionary<TObject> _table;
            private int _index;
            private KeyValuePair<Type, TObject> _current;

            public Enumerator(TypeObjectDictionary<TObject> table)
            {
                _table = table;
                _index = -1;
                _current = default;
            }

            public KeyValuePair<Type, TObject> Current => _current;
            object IEnumerator.Current => _current;

            public void Dispose() { }

            public bool MoveNext()
            {
                _index++;
                if (_index >= _table._count)
                    return false;
                var (key, value) = _table._storage[_index];
                _current = new KeyValuePair<Type, TObject>(key, value);
                return true;
            }

            public void Reset()
            {
                _index = -1;
            }
        }
    }
}
