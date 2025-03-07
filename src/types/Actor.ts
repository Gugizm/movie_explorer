export interface Actor {
  id: number;
  name: string;
  profile_path?: string;
  known_for?: Array<{ [key: string]: [] }>;
  biography?: string;
  birthday?: string;
  place_of_birth?: string;
}
