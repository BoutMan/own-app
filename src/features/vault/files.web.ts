/**
 * Web preview: no file system. The capture is already a small JPEG data URI and is kept as is in
 * the preview database (localStorage), so there is nothing to move or delete.
 */
export async function keepCapture(tempUri: string, _name: string): Promise<string> {
  return tempUri;
}

export async function deletePhotoFile(_uri: string): Promise<void> {}

export async function deleteAllPhotoFiles(): Promise<void> {}
