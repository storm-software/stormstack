export type ConsoleColor =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "gray";

export interface ConsoleSpinner {
  /**
	Change the text after the spinner.
	*/
  text: string;

  /**
	Change the text or function that returns text before the spinner.

	No prefix text will be displayed if set to an empty string.
	*/
  prefixText: string;

  /**
	Change the text or function that returns text after the spinner text.

	No suffix text will be displayed if set to an empty string.
	*/
  suffixText: string;

  /**
	Change the spinner color.
	*/
  color: ConsoleColor;

  /**
	Change the spinner indent.
	*/
  indent: number;

  /**
	A boolean of whether the instance is currently spinning.
	*/
  get isSpinning(): boolean;

  /**
	Start the spinner.

	@param text - Set the current text.
	@returns The spinner instance.
	*/
  start(text?: string): this;

  /**
	Stop and clear the spinner.

	@returns The spinner instance.
	*/
  stop(): this;

  /**
	Stop the spinner, change it to a green `✔` and persist the current text, or `text` if provided.

	@param text - Will persist text if provided.
	@returns The spinner instance.
	*/
  succeed(text?: string): this;

  /**
	Stop the spinner, change it to a red `✖` and persist the current text, or `text` if provided.

	@param text - Will persist text if provided.
	@returns The spinner instance.
	*/
  fail(text?: string): this;

  /**
	Stop the spinner, change it to a yellow `⚠` and persist the current text, or `text` if provided.

	@param text - Will persist text if provided.
	@returns The spinner instance.
	*/
  warn(text?: string): this;

  /**
	Stop the spinner, change it to a blue `ℹ` and persist the current text, or `text` if provided.

	@param text - Will persist text if provided.
	@returns The spinner instance.
	*/
  info(text?: string): this;

  /**
	Clear the spinner.

	@returns The spinner instance.
	*/
  clear(): this;

  /**
	Manually render a new frame.

	@returns The spinner instance.
	*/
  render(): this;
}
