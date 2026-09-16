// Flags for backend capabilities that do not exist yet. Each one gates a real HTTP
// implementation in lib/api/catMutations.ts — flipping the flag is the entire swap.
// Contract for the follow-up backend issue is documented in that file.

export const BACKEND_SUPPORTS_CAT_WRITES = false; // PATCH /api/v1/cats/{id}
export const BACKEND_SUPPORTS_IMAGE_UPLOAD = false; // POST /api/v1/cats/{id}/image
export const BACKEND_SUPPORTS_WEIGHT_HISTORY = false; // GET /api/v1/cats/{id}/weights
