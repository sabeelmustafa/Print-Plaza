function createCachedLoader(load, ttl = 60000) {
  let value, expires = 0, pending, version = 0;
  return {
    async get() {
      if (value !== undefined && Date.now() < expires) return value;
      if (pending) return pending;
      const current = version;
      const request = Promise.resolve().then(load).then(result => {
        if (current === version) { value = result; expires = Date.now() + ttl; }
        return result;
      }).finally(() => { if (pending === request) pending = undefined; });
      pending = request;
      return request;
    },
    invalidate() { version++; value = undefined; expires = 0; pending = undefined; },
  };
}
module.exports = { createCachedLoader };
