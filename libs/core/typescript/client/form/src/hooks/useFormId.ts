import { useAtomValue } from "jotai";
import { formIdAtom } from "../state";

export const useFormId = () => {
  // const formIdAtom = useMolecule(formIdMolecule);
  return useAtomValue(formIdAtom);
};
