/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Content type for both prompts and response candidates.
 * @public
 */
export interface Content extends InputContent {
  parts: Part[];
}

/**
 * Content that can be provided as history input to startChat().
 * @public
 */
export interface InputContent {
  parts: string | Array<string | Part>;
  role: string;
}

/**
 * Content part - includes text or image part types.
 * @public
 */
export type Part =
  | TextPart
  | InlineDataPart
  | FunctionCallPart
  | FunctionResponsePart;

/**
 * Content part interface if the part represents a text string.
 * @public
 */
export interface TextPart {
  text: string;
  inlineData?: never;
  functionCall?: never;
  functionResponse?: never;
}

/**
 * Content part interface if the part represents an image.
 * @public
 */
export interface InlineDataPart {
  text?: never;
  inlineData: GenerativeContentBlob;
  functionCall?: never;
  functionResponse?: never;
}

/**
 * Content part interface if the part represents FunctionResponse.
 * @public
 */
export interface FunctionCallPart {
  text?: never;
  inlineData?: never;
  functionCall: FunctionCall;
  functionResponse?: never;
}

/**
 * Content part interface if the part represents FunctionResponse.
 * @public
 */
export interface FunctionResponsePart {
  text?: never;
  inlineData?: never;
  functionCall?: never;
  functionResponse: FunctionResponse;
}

/**
 * A predicted [FunctionCall] returned from the model
 * that contains a string representing the [FunctionDeclaration.name]
 * and a structured JSON object containing the parameters and their values.
 * @public
 */
export interface FunctionCall {
  name: string;
  args: object;
}

/**
 * The result output from a [FunctionCall] that contains a string
 * representing the [FunctionDeclaration.name]
 * and a structured JSON object containing any output
 * from the function is used as context to the model.
 * This should contain the result of a [FunctionCall]
 * made based on model prediction.
 * @public
 */
export interface FunctionResponse {
  name: string;
  response: object;
}

/**
 * Interface for sending an image.
 * @public
 */
export interface GenerativeContentBlob {
  mimeType: string;
  /**
   * Image as a base64 string.
   */
  data: string;
}
