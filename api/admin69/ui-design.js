import { handleUiDesign } from "../_lib/ui-design.js";

// Same handler as /api/ui-design. The admin session cookie is only sent to /api/admin69.
export default function handler(req, res) {
  return handleUiDesign(req, res, { fresh: true });
}
