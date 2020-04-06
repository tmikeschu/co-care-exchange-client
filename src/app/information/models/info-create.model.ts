import { SaveUserInput } from '../../graphql/models/save-user-input.model';

export interface UserProfileInformation {
  userInput: SaveUserInput;
  organization?: String;
}
