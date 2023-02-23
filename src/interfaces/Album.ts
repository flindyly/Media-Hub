export interface Album {
    title: string,
    items: Array<string>, // array of MediaItem uids
    thumbnail: string,
    type: 'Course' | 'Group'
};