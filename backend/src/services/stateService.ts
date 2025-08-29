import { UserState, SortRequest, ReorderRequest } from '../types';

class StateService {
  private userStates: Map<string, UserState> = new Map();

  public getUserState(sessionId: string): UserState {
    if (!this.userStates.has(sessionId)) {
      this.userStates.set(sessionId, {
        selectedItems: new Set<number>(),
        sortOrder: [],
        sessionId
      });
    }
    return this.userStates.get(sessionId)!;
  }

  public updateSelectedItems(sessionId: string, itemId: number, selected: boolean): void {
    const state = this.getUserState(sessionId);
    if (selected) {
      state.selectedItems.add(itemId);
    } else {
      state.selectedItems.delete(itemId);
    }
  }

  public updateSortOrder(sessionId: string, sortRequest: SortRequest): void {
    const state = this.getUserState(sessionId);
    const { itemId, newPosition } = sortRequest;
    
    // Удаляем элемент из текущей позиции
    const currentIndex = state.sortOrder.indexOf(itemId);
    if (currentIndex !== -1) {
      state.sortOrder.splice(currentIndex, 1);
    }
    
    // Вставляем элемент в новую позицию
    state.sortOrder.splice(newPosition, 0, itemId);
  }

  // Новый метод для переупорядочивания элементов (Drag&Drop)
  public reorderItems(sessionId: string, reorderRequest: ReorderRequest): void {
    const state = this.getUserState(sessionId);
    const { toIndex, itemId } = reorderRequest;
    
    // Если элемент уже есть в sortOrder, обновляем его позицию
    const currentIndex = state.sortOrder.indexOf(itemId);
    if (currentIndex !== -1) {
      // Удаляем элемент из текущей позиции
      state.sortOrder.splice(currentIndex, 1);
      
      // Вставляем элемент в новую позицию
      const newIndex = Math.min(toIndex, state.sortOrder.length);
      state.sortOrder.splice(newIndex, 0, itemId);
    } else {
      // Если элемента нет в sortOrder, добавляем его в указанную позицию
      const insertIndex = Math.min(toIndex, state.sortOrder.length);
      state.sortOrder.splice(insertIndex, 0, itemId);
    }
  }

  public setSortOrder(sessionId: string, sortOrder: number[]): void {
    const state = this.getUserState(sessionId);
    state.sortOrder = [...sortOrder];
  }

  public getSelectedItems(sessionId: string): Set<number> {
    const state = this.getUserState(sessionId);
    return new Set(state.selectedItems);
  }

  public getSortOrder(sessionId: string): number[] {
    const state = this.getUserState(sessionId);
    return [...state.sortOrder];
  }

  public clearState(sessionId: string): void {
    this.userStates.delete(sessionId);
  }

  public getAllStates(): Map<string, UserState> {
    return new Map(this.userStates);
  }

  // Очистка старых сессий (можно вызывать периодически)
  public cleanupOldSessions(): void {
    // В реальном приложении здесь была бы логика очистки старых сессий
    // Пока оставляем все сессии в памяти
  }
}

export default new StateService();
