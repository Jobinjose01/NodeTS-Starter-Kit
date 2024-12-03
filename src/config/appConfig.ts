import path from 'path';

interface AppConfig {
    PUBLIC_ASSET_PATH: string | undefined;
    UPLOAD_LIMIT: string;
}

const appConfig: AppConfig = {
    PUBLIC_ASSET_PATH: process.env.PUBLIC_ASSET_PATH,
    UPLOAD_LIMIT: '1024mb',
};

export default appConfig;
