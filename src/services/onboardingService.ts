import { supabase } from "../lib/supabaseClient";
import { OnboardingRequest } from "../types/onboarding";

// Constants for backend configuration
const ONBOARDING_FUNCTION = "register-organisation";

export const onboardingService = {
  /**
   * Uploads a file to Supabase Storage.
   * @param file The file to upload.
   * @param bucket The storage bucket name.
   * @param fileName The name to store the file as.
   * @returns The public URL of the uploaded file.
   */
  async uploadFile(
    file: File,
    bucket: string,
    fileName: string,
  ): Promise<string> {
    const filePath = `${Date.now()}_${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Failed to upload ${fileName}: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return data.publicUrl;
  },

  /**
   * Submits the onboarding request.
   * @param payload The onboarding data with files as base64 strings.
   * @returns An object containing success status and message/error.
   */
  async submitOnboarding(payload: OnboardingRequest) {
    try {
      // 1. Invoke Edge Function with the direct payload
      // Files (logo, offerLetterPdf) are already base64 strings in the payload
      const { data, error } = await supabase.functions.invoke(
        ONBOARDING_FUNCTION,
        {
          body: payload,
        },
      );

      if (error) {
        throw new Error(error.message || "Submission failed");
      }

      if (data && data.error) {
        throw new Error(data.error);
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error in onboardingService:", error);
      let friendlyMessage = "Onboarding submission failed. Please try again.";
      if (error instanceof Error) {
        if (
          error.message.includes("Edge function") ||
          error.message.includes("non-2xx")
        ) {
          friendlyMessage =
            "Failed to process registration. Please check your invitation code and try again.";
        } else {
          friendlyMessage = error.message;
        }
      }

      return {
        success: false,
        error: friendlyMessage,
      };
    }
  },
};
