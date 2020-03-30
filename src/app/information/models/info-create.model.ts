import { CreateUserInput } from '../../graphql/models/create-user-input.model';

export interface InitialCreateInformation {
  userInput: CreateUserInput;
  organization?: String;
}
