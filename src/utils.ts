import { verifyTypedData } from '@ethersproject/wallet';
import { _TypedDataEncoder } from '@ethersproject/hash';

export const sendMessage = (ws, type, content) => {
  const message = JSON.stringify([type, content]);
  try {
    ws.send(message);
  } catch (e) {
    console.log(e);
  }
};

export const sendResponse = (ws, tag, response) => {
  sendMessage(ws, 'response', { tag, response });
};

export const sendErrorResponse = (ws, tag, error) => {
  const payload = { tag, response: { error } };
  sendMessage(ws, 'response', payload);
};

export const justsaying = (ws, subject, body) => {
  const payload = { subject, body };
  sendMessage(ws, 'justsaying', payload);
};

export function getHash(data) {
  const { domain, types, message } = data;
  return _TypedDataEncoder.hash(domain, types, message);
}

export async function verify(address, sig, data) {
  const { domain, types, message } = data;
  const recoverAddress = verifyTypedData(domain, types, message, sig);
  return address === recoverAddress;
}
