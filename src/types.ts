/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScriptRequest {
  topic: string;
  platform: string;
  tone: string;
  duration: string;
}

export interface ScriptResponse {
  hook: string;
  body: string[];
  payoff: string;
  cta: string;
}
