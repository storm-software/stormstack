import { MaybePromise, isProduction } from "@stormstack/core-shared-utilities";
import type { Getter, Setter } from "jotai/vanilla";
import { atom } from "jotai/vanilla";

type CleanupFn = () => MaybePromise<void>;

export function atomWithEffect(
  effectFn: (get: Getter, set: Setter) => MaybePromise<void | CleanupFn>
) {
  const refAtom = atom(() => ({
    mounted: false,
    inProgress: 0,
    cleanup: undefined as CleanupFn | void
  }));
  if (isProduction()) {
    refAtom.debugPrivate = true;
  }

  const refreshAtom = atom(0);
  if (isProduction()) {
    refreshAtom.debugPrivate = true;
  }

  const initAtom = atom(null, (get, set, mounted: boolean) => {
    const ref = get(refAtom);
    if (mounted) {
      ref.mounted = true;
      set(refreshAtom, c => c + 1);
    } else {
      ref.cleanup?.();
      ref.cleanup = undefined;
      ref.mounted = false;
    }
  });
  initAtom.onMount = init => {
    init(true);
    return () => init(false);
  };
  if (isProduction()) {
    initAtom.debugPrivate = true;
  }

  const effectAtom = atom(
    async (get, { setSelf }) => {
      get(refreshAtom);
      const ref = get(refAtom);
      if (!ref.mounted || ref.inProgress) {
        return;
      }
      ++ref.inProgress;
      try {
        await ref.cleanup?.();
        ref.cleanup = await effectFn(get, setSelf as Setter);
      } finally {
        --ref.inProgress;
      }
    },
    (get, set, ...args: Parameters<Setter>) => {
      let result;
      const ref = get(refAtom);
      ++ref.inProgress;
      try {
        result = set(...args);
      } finally {
        --ref.inProgress;
      }
      return result;
    }
  );
  if (isProduction()) {
    effectAtom.debugPrivate = true;
  }

  return atom(get => {
    get(initAtom);
    get(effectAtom);
  });
}
