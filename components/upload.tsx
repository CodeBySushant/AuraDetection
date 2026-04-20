import { detectAura } from "@/services/aura-api";
import { useAuraStore } from "@/lib/aura-store";

const { setAuraResult, setLoading, setError } = useAuraStore();

const handleUpload = async () => {
  try {
    setLoading();

    const result = await submitAuraForm(formData, name);

    setAuraResult(result);
  } catch (err) {
    setError(err);
  }
};