import { CreateUserInput } from '../../graphql/models/user-input.model';

export interface InitialCreateInformation {
  userInput: CreateUserInput;
  organization?: String;
}
