import { Item, ItemsQuery, ItemsResponse } from '../types';

class DataService {
  private items: Item[] = [];
  private readonly TOTAL_ITEMS = 1_000_000;

  constructor() {
    this.generateData();
  }

  private generateData(): void {
    const categories = ['Электроника', 'Одежда', 'Книги', 'Спорт', 'Дом', 'Авто', 'Красота', 'Игрушки'];
    const names = [
      'Продукт', 'Товар', 'Изделие', 'Предмет', 'Вещь', 'Устройство', 'Инструмент', 'Аксессуар'
    ];

    for (let i = 1; i <= this.TOTAL_ITEMS; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)]!;
      const name = names[Math.floor(Math.random() * names.length)]!;
      
      this.items.push({
        id: i,
        name: `${name} ${i}`,
        description: `Описание для ${name.toLowerCase()} ${i}. Категория: ${category}`,
        category: category,
        price: Math.floor(Math.random() * 10000) + 100,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
  }

  public getItems(query: ItemsQuery, customSortOrder?: number[]): ItemsResponse {
    const { offset = 0, limit = 20, search = '', sortBy, sortOrder = 'asc' } = query;

    let filteredItems = [...this.items];

    // Применяем поиск
    if (search) {
      const searchLower = search.toLowerCase();
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower)
      );
    }

    // Применяем кастомную сортировку (Drag&Drop)
    if (customSortOrder && customSortOrder.length > 0) {
      const sortMap = new Map(customSortOrder.map((id, index) => [id, index]));
      filteredItems.sort((a, b) => {
        const aIndex = sortMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
        const bIndex = sortMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
        return aIndex - bIndex;
      });
    } else if (sortBy) {
      // Применяем стандартную сортировку
      filteredItems.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return 0;
      });
    }

    const total = filteredItems.length;
    const paginatedItems = filteredItems.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return {
      items: paginatedItems,
      total,
      offset,
      limit,
      hasMore
    };
  }

  public getItemById(id: number): Item | undefined {
    return this.items.find(item => item.id === id);
  }

  public getTotalCount(): number {
    return this.TOTAL_ITEMS;
  }
}

export default new DataService();
