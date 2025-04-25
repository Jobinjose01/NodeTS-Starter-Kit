import * as fs from 'fs';
import * as path from 'path';

export function uploadFile(
    file: Express.Multer.File,
    destinationPath: string,
): string {
    const uploadPath = path.join(destinationPath, file.originalname);

    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath);
    }

    fs.writeFileSync(uploadPath, file.buffer);

    return uploadPath;
}
