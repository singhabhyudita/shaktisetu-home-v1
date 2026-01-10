import { supabase } from "../lib/supabaseClient";
import { OnboardingRequest, OnboardingResponse } from "../types/onboarding";

// Constants for backend configuration
const ONBOARDING_FUNCTION = "register-organisation";

export class OnboardingService {
  /**
   * Uploads a file to a signed URL.
   * @param bucket Storage bucket name.
   * @param path The path of the file to upload.
   * @param token The token for the signed URL.
   * @param file The file to upload.
   */
  static async uploadToSignedUrl(
    bucket: string,
    path: string,
    token: string,
    file: File,
  ) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .uploadToSignedUrl(path, token, file);

    if (error) {
      throw new Error(`Failed to upload to signed URL: ${error.message}`);
    }

    return data;
  }

  /**
   * Submits the onboarding request.
   * @param payload The onboarding data.
   * @param logo Optional organization logo file.
   * @param offerLetter Optional offer letter template PDF file.
   * @returns An object containing success status, response data, and any error.
   */
  static async submitOnboarding(
    payload: OnboardingRequest,
    logo: File | null = null,
    offerLetter: File | null = null,
  ): Promise<{
    success: boolean;
    error: string;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke(
        ONBOARDING_FUNCTION,
        {
          body: payload,
        },
      );
      if (error) {
        let message = error.message;
        try {
          const body = await error.context.json();
          message = body.error;
        } catch (_) {
          message = "Failed to process registration. Please try again.";
        }
        return {
          success: false,
          error: message,
        };
      }
      const { data: responseData } = data || {};
      const onboardingData = responseData as OnboardingResponse;

      const uploadPromises = [];

      if (logo && onboardingData.logo) {
        uploadPromises.push(
          OnboardingService.uploadToSignedUrl(
            "logo",
            onboardingData.logo.path,
            onboardingData.logo.token,
            logo,
          ),
        );
      }

      if (offerLetter && onboardingData.offer_letter) {
        uploadPromises.push(
          OnboardingService.uploadToSignedUrl(
            "offer-letter-template",
            onboardingData.offer_letter.path,
            onboardingData.offer_letter.token,
            offerLetter,
          ),
        );
      }

      if (uploadPromises.length > 0) {
        try {
          await Promise.all(uploadPromises);
        } catch (uploadError) {
          return {
            success: false,
            error:
              "Registration succeeded but file uploads failed. Please contact support.",
          };
        }
      }

      return { success: true, error: "" };
    } catch (error) {
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
  }
}
