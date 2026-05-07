import { baseApi } from "@/redux/store/baseApi";

// --- Types & Interfaces ---
export type InstructionRole =
  | "staff"
  | "tattoo_artist"
  | "body_piercer"
  | "district_manager"
  | "branch_manager"
  | "all"
  | "qr_attendee";
export interface Instruction {
  id: number;
  title: string;
  description: string;
  pdf_url: string | null;
  pdf_filename: string | null;
  role_visibility: string[];
  created_at: string;
  updated_at?: string;
}

export interface InstructionStats {
  total_instructions: number;
  tattoo_artists: number;
  body_piercers: number;
  staff: number;
}

// export interface InstructionListResponse {
//   stats: InstructionStats;
//   instructions: Instruction[];
//   grouped: {
//     tattoo_artist: Instruction[];
//     body_piercer: Instruction[];
//     staff: Instruction[];
//   };
// }

export interface CreateInstructionRequest {
  title: string;
  description: string;
  role_visibility: string; // Backend expects: "tattoo_artist", "body_piercer", or "staff"
  pdf_file?: File;
}

export interface CreateInstructionJsonRequest {
  title: string;
  description: string;
  role_visibility: string;
}

export interface InstructionStats {
  total_instructions: number;
  tattoo_artists: number;
  body_piercers: number;
  staff: number;
  branch_managers: number; // Added
  district_managers: number; // Added
}

export interface InstructionListResponse {
  stats: InstructionStats;
  grouped: Array<{
    section: string;
    document_count: number;
    instructions: Instruction[];
  }>;
}
// --- Helper Functions ---

/**
 * Prepares instruction data for submission.
 * Handles both FormData (with PDF file) and JSON (without file)
 */
export const prepareInstructionData = (
  data: CreateInstructionRequest,
): FormData | CreateInstructionJsonRequest => {
  // If a file is selected, use FormData
  if (data.pdf_file) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("role_visibility", data.role_visibility);
    formData.append("pdf_file", data.pdf_file);
    return formData;
  }

  // Otherwise, send as JSON
  return {
    title: data.title,
    description: data.description,
    role_visibility: data.role_visibility,
  };
};

// --- API Slice ---

export const instructionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: List all instructions and stats
    // getInstructions: builder.query<InstructionListResponse, void>({
    //   query: () => ({
    //     url: "/admin/instructions/",
    //     method: "GET",
    //   }),
    //   providesTags: ["Instructions"],
    // }),

    getInstructions: builder.query<
      InstructionListResponse,
      { role?: string; search?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.role && params.role !== "all")
          queryParams.append("role", params.role);
        if (params?.search) queryParams.append("search", params.search);

        return {
          url: `/admin/instructions/?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Instructions"],
    }),

    // POST: Create Instruction with dual data support (FormData with file OR JSON)
    // Automatically handles Content-Type header based on data type
    createInstruction: builder.mutation<
      { message: string; instruction: Instruction },
      CreateInstructionRequest
    >({
      query: (data) => {
        const body = prepareInstructionData(data);
        return {
          url: "/admin/instructions/",
          method: "POST",
          body,
          // RTK Query automatically handles headers:
          // - For FormData: removes Content-Type to let browser set boundary
          // - For JSON objects: sets Content-Type to application/json
        };
      },
      invalidatesTags: ["Instructions"],
    }),

    // GET: Single Instruction details
    getInstructionDetails: builder.query<Instruction, number>({
      query: (id) => `/admin/instructions/${id}/`,
      providesTags: (result, error, id) => [{ type: "Instructions", id }],
    }),

    // PATCH: Update instruction (with file or JSON)
    updateInstruction: builder.mutation<
      { message: string; instruction: Instruction },
      { id: number; data: CreateInstructionRequest }
    >({
      query: ({ id, data }) => {
        const body = prepareInstructionData(data);
        return {
          url: `/admin/instructions/${id}/`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        "Instructions",
        { type: "Instructions", id },
      ],
    }),

    // DELETE: Remove instruction
    deleteInstruction: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/admin/instructions/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Instructions"],
    }),

    // GET: Instructions by category/role
    getInstructionsByRole: builder.query<Instruction[], string>({
      query: (role) => `/admin/instructions/?role=${role}`,
      providesTags: (result, error, role) => [
        { type: "Instructions", id: `role-${role}` },
      ],
    }),
  }),
});

export const {
  useGetInstructionsQuery,
  useCreateInstructionMutation,
  useGetInstructionDetailsQuery,
  useUpdateInstructionMutation,
  useDeleteInstructionMutation,
  useGetInstructionsByRoleQuery,
} = instructionApi;
