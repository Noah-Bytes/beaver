import { IsNotEmpty } from 'class-validator';

export class ShellFlowClass {
  @IsNotEmpty({
    message: 'homeDir is required',
  })
  homeDir!: string;
}
