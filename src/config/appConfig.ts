interface AppConfig {
    PUBLIC_ASSET_PATH: string | undefined;
    UPLOAD_LIMIT: string;
    UPLOAD_SIZE_LIMIT: number;
}

const appConfig: AppConfig = {
    PUBLIC_ASSET_PATH: process.env.PUBLIC_ASSET_PATH,
    UPLOAD_LIMIT: '1024mb',
    UPLOAD_SIZE_LIMIT: 5, //5MB
};

export default appConfig;
