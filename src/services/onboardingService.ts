import { supabase } from "../lib/supabaseClient";
import { OnboardingRequest } from "../types/onboarding";

// Constants for backend configuration
const ONBOARDING_FUNCTION = "register-organisation";
const BUCKET_LOGOS = "logos";
const BUCKET_TEMPLATES = "templates";

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
   * @param payload The onboarding data.
   * @returns An object containing success status and message/error.
   */
  async submitOnboarding(payload: OnboardingRequest) {
    try {
      let logoUrl = "";
      let offerLetterUrl = "";

      // 1. Upload Logo if present
      if (payload.org.logo) {
        logoUrl = await this.uploadFile(
          payload.org.logo,
          BUCKET_LOGOS,
          `logo_${payload.org.name.replace(/\s+/g, "_")}`,
        );
      }

      // 2. Upload Offer Letter if present
      if (payload.org.offerLetterPdf) {
        offerLetterUrl = await this.uploadFile(
          payload.org.offerLetterPdf,
          BUCKET_TEMPLATES,
          `template_${payload.org.name.replace(/\s+/g, "_")}`,
        );
      }

      // 3. Prepare final payload for the Edge Function
      const submissionData = {
        ...payload,
        org: {
          ...payload.org,
          logo: logoUrl || null,
          offerLetterPdf: offerLetterUrl || null,
        },
      };

      // 4. Invoke Edge Function
      const { data, error } = await supabase.functions.invoke(
        ONBOARDING_FUNCTION,
        {
          body: submissionData,
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
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Onboarding submission failed",
      };
    }
  },
};
