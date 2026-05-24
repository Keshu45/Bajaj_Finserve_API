export interface ApiResponse {
  is_success: boolean;
  user_id: string;
  email: string;
  roll_number: string;
  numbers: string[];
  alphabets: string[];
  highest_lowercase_alphabet: string[];
  is_prime_found: boolean;
  file_valid: boolean;
  file_mime_type: string;
  file_size_kb: string;
}

export type FilterOption = "Numbers" | "Alphabets" | "Highest lowercase alphabet";
