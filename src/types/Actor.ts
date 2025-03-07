export interface Actor {
  id: number;
  name: string;
  profile_path?: string; // Optional, already used in your Actors component
  known_for?: Array<{ [key: string]: [] }>; // From your Actors component
  biography?: string; // Added for biography
  birthday?: string; // Added for birthday (usually a date string like "YYYY-MM-DD")
  place_of_birth?: string; // Added for place of birth
}
