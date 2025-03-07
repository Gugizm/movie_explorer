export interface Actor {
  id: number;
  name: string;
  profile_path?: string;
  known_for?: { title: string }[];
  birthday?: string;
  place_of_birth?: string;
  biography?: string;
}
