import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'react-native';

// WhatsApp, phone and email open their own apps. Every other outside link opens in the in-app browser,
// so she can tap Done and come straight back.
const OWN_APP = /^(tel:|mailto:|sms:|whatsapp:|https?:\/\/(wa\.me|api\.whatsapp\.com)\/)/i;

export async function openOutside(url: string | null | undefined): Promise<void> {
  if (!url) return;
  try {
    if (OWN_APP.test(url)) await Linking.openURL(url);
    else await WebBrowser.openBrowserAsync(url);
  } catch (e) {
    console.error('open link', url, e);
  }
}
