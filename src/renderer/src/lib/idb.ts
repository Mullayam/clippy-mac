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

    async addItem(item: Omit<ClipboardItem, 'id'>) {
        // Deduplicate: if same content already exists, move it to top
        const existing = await this.history
            .filter((row) => row.content === item.content && row.type === item.type)
            .first();

        if (existing) {
            await this.history.update(existing.id!, { time: item.time });
            return;
        }

        await this.history.add(item as ClipboardItem);
        const count = await this.history.count();

        if (count > 50) {
            const toDelete = await this.history
                .orderBy('time')
                .limit(count - 50)
                .toArray();

            await Promise.all(toDelete.map((row) => this.history.delete(row.id!)));
        }
    }

    async deleteItem(id: number) {
        await this.history.delete(id);
    }

    async getHistory(): Promise<ClipboardItem[]> {
        return this.history.orderBy('time').reverse().toArray();
    }

    async clearHistory() {
        await this.history.clear();
    }
}

export const db = new ClipboardDB();
