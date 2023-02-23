export interface MediaItem {
    uid: string,
    type: Array<string>,
    title: string,
    keywords: Array<string>,
    contributor: string,
    school?: Array<string>,
    department?: Array<string>,
    thumbnail: string,
    thumbnailType: 'Video' | 'Static',
    visitCount: number,
    date: Date,
    published: boolean
};