import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/**
 * "Export my data": one JSON file in the app's cache, handed to the iOS share sheet. She chooses
 * where it goes (Files, AirDrop, mail); Own sends it nowhere itself.
 */
export async function shareExport(name: string, json: string): Promise<void> {
  const file = new File(Paths.cache, name);
  if (file.exists) file.delete();
  file.create();
  file.write(json);
  await Sharing.shareAsync(file.uri, { mimeType: 'application/json', UTI: 'public.json', dialogTitle: 'Export my Own data' });
  file.delete();
}
