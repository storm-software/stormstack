import { Getter, Setter, atom } from "jotai";
import { useMolecule } from "jotai-molecules";
import { Molecule, MoleculeGetter, ScopeGetter } from "jotai-molecules/dist/molecule";
import { useAtomValue } from "jotai/react";
import { useAtomCallback } from "jotai/utils";
import { useCallback } from "react";
import { AlertMolecule, Alert, AlertScope, alertsAtom } from "../models/alerts";
import { moleculeWithWebStorage } from "../state/moleculeWithWebStorage";
import { MessageTypes } from "../types";

export const useAlerts = (): Record<string, Molecule<AlertMolecule>> => {
  const alerts = useAtomValue(alertsAtom);
  return alerts;
};

export const useAlertsList = (): Molecule<AlertMolecule>[] => {
  const alerts = useAlerts();

  return Object.values(alerts).reduce(
    (ret: Molecule<AlertMolecule>[], alert: Molecule<AlertMolecule>) => {
      ret.push(alert);
      return ret;
    },
    []
  );
};

export const useAlert = (id: string): AlertDetails | undefined => {
  const alerts = useAtomValue(alertsAtom);
  return useMolecule(alerts[id]);
};

export const useSetAlerts = () => {
  const add = useAtomCallback(
    useCallback((_: Getter, set: Setter, alert: Alert) => {
      const alertMolecule: Molecule<AlertMolecule> = moleculeWithWebStorage(
        AlertScope,
        (__: string | undefined, ___: MoleculeGetter, ____: ScopeGetter) => {
          const typeAtom = atom<MessageTypes>(alert.type);
          const summaryAtom = atom<string | undefined>(alert.summary);
          const detailsAtom = atom<string | undefined>(alert.details);
          const isExtendableAtom = atom<boolean>(!!alert.isExtendable);

          return {
            id: alert.id,
            typeAtom,
            summaryAtom,
            detailsAtom,
            isExtendableAtom,
          };
        }
      );

      set(alertsAtom, (prev: Record<string, Molecule<AlertMolecule>>) =>
        alert.id
          ? {
              ...prev,
              [alert.id]: alertMolecule,
            }
          : prev
      );
    }, [])
  );

  const remove = useAtomCallback(
    useCallback((_: Getter, set: Setter, id: string) => {
      set(alertsAtom, (prev: Record<string, Molecule<AlertMolecule>>) => {
        delete prev[id];
        return prev;
      });
    }, [])
  );

  return { add, remove };
};
