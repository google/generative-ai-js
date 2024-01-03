/**
 * @license
 * Copyright 2024 Google LLC
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

import {
  HarmBlockThreshold,
  HarmCategory,
  FunctionDeclarationSchemaType,
} from "@google/generative-ai";
import { genAI } from "./utils/common.js";

async function run() {
  // For text-only inputs, use the gemini-pro model
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    apiVersion: "v1beta",
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  });

  const tool = {
    functionDeclarations: [
      {
        name: "find_theaters",
        description:
          "find theaters based on location and optionally movie title which are is currently playing in theaters",
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            location: {
              type: FunctionDeclarationSchemaType.STRING,
              description:
                "The city and state, e.g. San Francisco, CA or a zip code e.g. 95616",
            },
            movie: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "Any movie title",
            },
          },
          required: ["location"],
        },
      },
    ],
  };

  const functions = {
    find_theaters: ({ location, movie }) => {
      if (movie !== "Barbie") {
        return {
          movie,
          theaters: [],
        };
      }
      switch (location) {
        case "Mountain View, CA":
          return {
            movie,
            theaters: [
              {
                name: "AMC Mountain View 16",
                address: "2000 W El Camino Real, Mountain View, CA 94040",
              },
              {
                name: "Regal Edwards 14",
                address: "245 Castro St, Mountain View, CA 94040",
              },
            ],
          };
        default:
          return {
            movie,
            theaters: [],
          };
      }
    },
  };

  const content1 = {
    role: "user",
    parts: [
      {
        text: "Which theaters in Mountain View show Barbie movie?",
      },
    ],
  };

  const response1 = await model.generateContent({
    contents: [content1],
    tools: [tool],
  });

  console.log(JSON.stringify(response1, null, 2));
  const candidate = response1.response.candidates[0];
  const content2 = candidate.content;
  const part = content2.parts[0];

  if (!part) {
    throw new Error("Unknown response");
  }
  if (!part.functionCall) {
    console.log(part.text());
    return;
  }

  const functionName = part.functionCall.name;
  if (!functions[functionName]) {
    throw new Error("Unknown function");
  }

  const functionResponse = functions[functionName](part.functionCall.args);

  const response2 = await model.generateContent({
    contents: [
      content1,
      content2,
      {
        role: "function",
        parts: [
          {
            functionResponse: {
              name: "find_theaters",
              response: functionResponse,
            },
          },
        ],
      },
    ],
    tools: [tool],
  });

  // Display the aggregated response
  console.log(JSON.stringify(response2.response, null, 2));
}

run();
