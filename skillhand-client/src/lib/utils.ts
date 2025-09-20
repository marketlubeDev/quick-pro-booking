import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input - The string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .replace(/[<>]/g, "") // Remove < and > characters
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
}

/**
 * Sanitizes phone number input
 * @param phone - Phone number string
 * @returns Sanitized phone number
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== "string") {
    return "";
  }

  // Remove all non-digit characters except +, -, (, ), and space
  return phone.replace(/[^\d\s\(\)\+\-]/g, "").trim();
}

/**
 * Sanitizes email input
 * @param email - Email string
 * @returns Sanitized email
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== "string") {
    return "";
  }

  // Basic email sanitization - remove script tags and other dangerous content
  return email
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .toLowerCase()
    .trim();
}

/**
 * Sanitizes ZIP code input
 * @param zip - ZIP code string
 * @returns Sanitized ZIP code (digits only)
 */
export function sanitizeZipCode(zip: string): string {
  if (typeof zip !== "string") {
    return "";
  }

  // Only allow digits
  return zip.replace(/\D/g, "").substring(0, 5);
}

/**
 * Sanitizes textarea content while preserving spaces and formatting
 * @param text - The text to sanitize
 * @returns Sanitized text
 */
export function sanitizeTextarea(text: string): string {
  if (typeof text !== "string") {
    return "";
  }

  return (
    text
      .replace(/[<>]/g, "") // Remove < and > characters
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+=/gi, "") // Remove event handlers
      // Don't trim here to preserve user's intended spacing
      .replace(/\0/g, "")
  ); // Remove null characters
}

/**
 * Sanitizes regular input fields while preserving spaces
 * @param input - The string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInputField(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .replace(/[<>]/g, "") // Remove < and > characters
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .replace(/\0/g, ""); // Remove null characters
  // Removed .trim() to preserve all spaces including leading/trailing
}
