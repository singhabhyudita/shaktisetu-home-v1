import { supabase } from "../lib/supabaseClient";

export const notificationService = {
  /**
   * Acknowledges a notification using a token.
   * @param token The acknowledgement token from the URL.
   * @returns An object containing success status and message/error.
   */
  async acknowledgeNotification(token: string) {
    try {
      const { data, error } = await supabase.functions.invoke(
        `acknowledge-sms-notification?token=${encodeURIComponent(token)}`,
        {
          method: "GET",
        },
      );

      if (error) {
        // Handle Edge Function error
        try {
          const errorMsg =
            typeof error === "string"
              ? error
              : (await error.json?.())?.error || error.message;
          return { success: false, error: errorMsg };
        } catch (e) {
          return {
            success: false,
            error: error.message || "Failed to acknowledge token",
          };
        }
      }

      // Supabase invoke returns the response body directly in 'data'
      // If it's a string (HTML), it means success in this specific flow
      if (typeof data === "string") {
        const isHtml =
          data.trim().toLowerCase().startsWith("<!doctype") ||
          data.trim().toLowerCase().startsWith("<html");
        if (isHtml) {
          return {
            success: true,
            message: "Notification acknowledged successfully!",
          };
        }
      }

      // If it's JSON, check for errors
      if (data && data.error) {
        return { success: false, error: data.error };
      }

      return {
        success: true,
        message: data?.message || "Notification acknowledged successfully!",
      };
    } catch (error) {
      console.error("Error in notificationService:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to acknowledge token",
      };
    }
  },
};
