export class WhatssapClient {
  async sendMessage(recipient: string, text: string): Promise<void> {
    console.log(`Sending message to ${recipient}: ${text}`);
  }
}
