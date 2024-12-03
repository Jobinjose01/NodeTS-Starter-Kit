export interface Language {
    id?: number;
    title: string;
    langCode: string;
    flag?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
