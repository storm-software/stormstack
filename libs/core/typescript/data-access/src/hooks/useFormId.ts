import { useAtomValue } from "jotai";
import { useMolecule } from "jotai-molecules";
import { formIdMolecule } from "../models/form";

export const useFormId = () => {
  const formIdAtom = useMolecule(formIdMolecule);
  return useAtomValue(formIdAtom);
};
