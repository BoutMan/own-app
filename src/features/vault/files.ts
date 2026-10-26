import { Directory, File, Paths } from 'expo-file-system';

/**
 * Vault photo files: inside the app's private documents folder, never uploaded, never in the
 * photo library (CLAUDE.md, rule 2). They follow the device backup like the database (session 5).
 */
function vaultDir(): Directory {
  const dir = new Directory(Paths.document, 'vault');
  if (!dir.exists) dir.create({ intermediates: true });
  return dir;
}

/** Moves a fresh camera capture into the vault and returns its new uri. */
export async function keepCapture(tempUri: string, name: string): Promise<string> {
  const target = new File(vaultDir(), `${name}.jpg`);
  if (target.exists) target.delete();
  new File(tempUri).move(target);
  return target.uri;
}

export async function deletePhotoFile(uri: string): Promise<void> {
  const f = new File(uri);
  if (f.exists) f.delete();
}

/** "Erase all my data": the whole folder goes. */
export async function deleteAllPhotoFiles(): Promise<void> {
  const dir = new Directory(Paths.document, 'vault');
  if (dir.exists) dir.delete();
}
