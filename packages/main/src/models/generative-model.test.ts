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
import { expect, use } from "chai";
import { GenerativeModel } from "./generative-model";
import * as sinonChai from "sinon-chai";
import { FunctionCallingMode } from "../../types";
import { getMockResponse } from "../../test-utils/mock-response";
import { match, restore, stub } from "sinon";
import * as request from "../requests/request";

use(sinonChai);

describe("GenerativeModel", () => {
  it("handles plain model name", () => {
    const genModel = new GenerativeModel("apiKey", { model: "my-model" });
    expect(genModel.model).to.equal("models/my-model");
  });
  it("handles prefixed model name", () => {
    const genModel = new GenerativeModel("apiKey", {
      model: "models/my-model",
    });
    expect(genModel.model).to.equal("models/my-model");
  });
  it("handles prefixed tuned model name", () => {
    const genModel = new GenerativeModel("apiKey", {
      model: "tunedModels/my-model",
    });
    expect(genModel.model).to.equal("tunedModels/my-model");
  });
  it("passes params through to generateContent", async () => {
    const genModel = new GenerativeModel("apiKey", {
      model: "my-model",
      tools: [{ functionDeclarations: [{ name: "myfunc" }] }],
      toolConfig: { functionCallingConfig: { mode: FunctionCallingMode.NONE } },
      systemInstruction: { role: "system", parts: [{ text: "be friendly" }] },
    });
    expect(genModel.tools?.length).to.equal(1);
    expect(genModel.toolConfig?.functionCallingConfig.mode).to.equal(
      FunctionCallingMode.NONE,
    );
    expect(genModel.systemInstruction?.parts[0].text).to.equal("be friendly");
    const mockResponse = getMockResponse(
      "unary-success-basic-reply-short.json",
    );
    const makeRequestStub = stub(request, "makeRequest").resolves(
      mockResponse as Response,
    );
    await genModel.generateContent("hello");
    expect(makeRequestStub).to.be.calledWith(
      "models/my-model",
      request.Task.GENERATE_CONTENT,
      match.any,
      false,
      match((value: string) => {
        return (
          value.includes("myfunc") &&
          value.includes(FunctionCallingMode.NONE) &&
          value.includes("be friendly")
        );
      }),
      {},
    );
    restore();
  });
  it("generateContent overrides model values", async () => {
    const genModel = new GenerativeModel("apiKey", {
      model: "my-model",
      tools: [{ functionDeclarations: [{ name: "myfunc" }] }],
      toolConfig: { functionCallingConfig: { mode: FunctionCallingMode.NONE } },
      systemInstruction: { role: "system", parts: [{ text: "be friendly" }] },
    });
    expect(genModel.tools?.length).to.equal(1);
    expect(genModel.toolConfig?.functionCallingConfig.mode).to.equal(
      FunctionCallingMode.NONE,
    );
    expect(genModel.systemInstruction?.parts[0].text).to.equal("be friendly");
    const mockResponse = getMockResponse(
      "unary-success-basic-reply-short.json",
    );
    const makeRequestStub = stub(request, "makeRequest").resolves(
      mockResponse as Response,
    );
    await genModel.generateContent({
      contents: [{ role: "user", parts: [{ text: "hello" }] }],
      tools: [{ functionDeclarations: [{ name: "otherfunc" }] }],
      toolConfig: { functionCallingConfig: { mode: FunctionCallingMode.AUTO } },
      systemInstruction: { role: "system", parts: [{ text: "be formal" }] },
    });
    expect(makeRequestStub).to.be.calledWith(
      "models/my-model",
      request.Task.GENERATE_CONTENT,
      match.any,
      false,
      match((value: string) => {
        return (
          value.includes("otherfunc") &&
          value.includes(FunctionCallingMode.AUTO) &&
          value.includes("be formal")
        );
      }),
      {},
    );
    restore();
  });
  it("passes params through to chat.sendMessage", async () => {
    const genModel = new GenerativeModel("apiKey", {
      model: "my-model",
      tools: [{ functionDeclarations: [{ name: "myfunc" }] }],
      toolConfig: { functionCallingConfig: { mode: FunctionCallingMode.NONE } },
      systemInstruction: { role: "system", parts: [{ text: "be friendly" }] },
    });
    expect(genModel.tools?.length).to.equal(1);
    expect(genModel.toolConfig?.functionCallingConfig.mode).to.equal(
      FunctionCallingMode.NONE,
    );
    expect(genModel.systemInstruction?.parts[0].text).to.equal("be friendly");
    const mockResponse = getMockResponse(
      "unary-success-basic-reply-short.json",
    );
    const makeRequestStub = stub(request, "makeRequest").resolves(
      mockResponse as Response,
    );
    await genModel.startChat().sendMessage("hello");
    expect(makeRequestStub).to.be.calledWith(
      "models/my-model",
      request.Task.GENERATE_CONTENT,
      match.any,
      false,
      match((value: string) => {
        return (
          value.includes("myfunc") &&
          value.includes(FunctionCallingMode.NONE) &&
          value.includes("be friendly")
        );
      }),
      {},
    );
    restore();
  });
  it("startChat overrides model values", async () => {
    const genModel = new GenerativeModel("apiKey", {
      model: "my-model",
      tools: [{ functionDeclarations: [{ name: "myfunc" }] }],
      toolConfig: { functionCallingConfig: { mode: FunctionCallingMode.NONE } },
      systemInstruction: { role: "system", parts: [{ text: "be friendly" }] },
    });
    expect(genModel.tools?.length).to.equal(1);
    expect(genModel.toolConfig?.functionCallingConfig.mode).to.equal(
      FunctionCallingMode.NONE,
    );
    expect(genModel.systemInstruction?.parts[0].text).to.equal("be friendly");
    const mockResponse = getMockResponse(
      "unary-success-basic-reply-short.json",
    );
    const makeRequestStub = stub(request, "makeRequest").resolves(
      mockResponse as Response,
    );
    await genModel
      .startChat({
        tools: [{ functionDeclarations: [{ name: "otherfunc" }] }],
        toolConfig: {
          functionCallingConfig: { mode: FunctionCallingMode.AUTO },
        },
        systemInstruction: { role: "system", parts: [{ text: "be formal" }] },
      })
      .sendMessage("hello");
    expect(makeRequestStub).to.be.calledWith(
      "models/my-model",
      request.Task.GENERATE_CONTENT,
      match.any,
      false,
      match((value: string) => {
        return (
          value.includes("otherfunc") &&
          value.includes(FunctionCallingMode.AUTO) &&
          value.includes("be formal")
        );
      }),
      {},
    );
    restore();
  });
});
