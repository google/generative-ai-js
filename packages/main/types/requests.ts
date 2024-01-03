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

import { Content, InputContent } from "./content";
import { HarmBlockThreshold, HarmCategory, TaskType } from "./enums";

/**
 * Base parameters for a number of methods.
 * @public
 */
export interface BaseParams {
  safetySettings?: SafetySetting[];
  generationConfig?: GenerationConfig;
}

/**
 * Params passed to {@link GoogleGenerativeAI.getGenerativeModel}.
 * @public
 */
export interface ModelParams extends BaseParams {
  model: string;
  apiVersion?: string;
}

/**
 * Request sent to `generateContent` endpoint.
 * @public
 */
export interface GenerateContentRequest extends BaseParams {
  contents: Content[];
  tools?: Tool[];
}

/**
 * Safety setting that can be sent as part of request parameters.
 * @public
 */
export interface SafetySetting {
  category: HarmCategory;
  threshold: HarmBlockThreshold;
}

/**
 * Config options for content-related requests
 * @public
 */
export interface GenerationConfig {
  candidateCount?: number;
  stopSequences?: string[];
  maxOutputTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
}

/**
 * Params for {@link GenerativeModel.startChat}.
 * @public
 */
export interface StartChatParams extends BaseParams {
  history?: InputContent[];
}

/**
 * Params for calling {@link GenerativeModel.countTokens}
 * @public
 */
export interface CountTokensRequest {
  contents: Content[];
}

/**
 * Params for calling {@link GenerativeModel.embedContent}
 * @public
 */
export interface EmbedContentRequest {
  content: Content;
  taskType?: TaskType;
  title?: string;
}

/**
 * Params for calling  {@link GenerativeModel.batchEmbedContents}
 * @public
 */
export interface BatchEmbedContentsRequest {
  requests: EmbedContentRequest[];
}

/**
 * A Tool is a piece of code that enables the system
 * to interact * with external systems to perform an action,
 * or set of actions, outside of knowledge and scope of the model.
 * @public
 */
export interface Tool {
  functionDeclarations: FunctionDeclaration[];
}

/**
 * Contains the list of OpenAPI data types
 * as defined by https://swagger.io/docs/specification/data-models/data-types/
 * @public
 */
export enum FunctionDeclarationSchemaType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  INTEGER = "INTEGER",
  BOOLEAN = "BOOLEAN",
  ARRAY = "ARRAY",
  OBJECT = "OBJECT",
}

/**
 * Structured representation of a function declaration
 * as defined by the OpenAPI 3.0 specification.
 * Included in this declaration are the function name and parameters.
 * This FunctionDeclaration is a representation of a block of code
 * that can be used as a Tool by the model and executed by the client.
 * @public
 */
export interface FunctionDeclaration {
  name: string;
  description: string;
  parameters: FunctionDeclarationSchema;
}

/**
 * Schema is used to define the format of input/output data.
 * Represents a select subset of an OpenAPI 3.0 schema object.
 * More fields may be added in the future as needed.
 * @public
 */
export interface FunctionDeclarationSchema {
  type?: FunctionDeclarationSchemaType;
  format?: string;
  description?: string;
  nullable?: boolean;
  items?: FunctionDeclarationSchema;
  enum?: string[];
  properties?: { [k: string]: FunctionDeclarationSchema };
  required?: string[];
  example?: unknown;
}
