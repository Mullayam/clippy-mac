import Dexie, { Table } from 'dexie';

export interface ClipboardItem {
    id: number;
    type: 'text' | 'image';
    content: string;
    time: number;
}

class ClipboardDB extends Dexie {
    history!: Table<ClipboardItem, number>;

    constructor() {
        super('ClipboardDB');
        this.version(1).stores({
            history: '++id, time',
        });
    }

    async addItem(item: ClipboardItem) {
        await this.history.add(item);
        const count = await this.history.count();

        if (count > 50) {
            // Delete oldest items
            const toDelete = await this.history
                .orderBy('time')
                .limit(count - 50)
                .toArray();

            await Promise.all(toDelete.map((item) => this.history.delete(item.id!)));
        }
    }

    async getHistory(): Promise<ClipboardItem[]> {
        return this.history.orderBy('time').reverse().toArray();
    }
    async clearHistory() {
        await this.history.clear();
    }
}

export const db = new ClipboardDB();
