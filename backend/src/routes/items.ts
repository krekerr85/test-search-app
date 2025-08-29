import { Router, Request, Response } from 'express';
import dataService from '../services/dataService';
import stateService from '../services/stateService';
import { ItemsQuery, SortRequest, ReorderRequest, Item } from '../types';

const router = Router();

const getSessionId = (req: Request): string => {
  return req.headers['x-session-id'] as string || 'default-session';
};

router.get('/', async (req: Request, res: Response) => {
  try {
    
    const sessionId = getSessionId(req);
    const sortByParam = req.query['sortBy'] as string;
    const query: ItemsQuery = {
      offset: parseInt(req.query['offset'] as string) || 0,
      limit: parseInt(req.query['limit'] as string) || 20,
      search: req.query['search'] as string || '',
      sortBy: sortByParam as keyof Item,
      sortOrder: (req.query['sortOrder'] as 'asc' | 'desc') || 'asc'
    };

    const customSortOrder = stateService.getSortOrder(sessionId);
    
    const result = dataService.getItems(query, customSortOrder);
    
    res.json(result);
  } catch (error) {
    console.error('Ошибка при получении элементов:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

router.get('/state', async (req: Request, res: Response) => {
  try {
    
    const sessionId = getSessionId(req);
    const selectedItems = stateService.getSelectedItems(sessionId);
    const sortOrder = stateService.getSortOrder(sessionId);
    
    res.json({
      selectedItems: Array.from(selectedItems),
      sortOrder
    });
  } catch (error) {
    console.error('Ошибка при получении состояния:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

router.post('/select', (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);
    const { itemId, selected } = req.body;
    
    if (typeof itemId !== 'number' || typeof selected !== 'boolean') {
      return res.status(400).json({ error: 'Неверные параметры' });
    }
    
    stateService.updateSelectedItems(sessionId, itemId, selected);
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обновлении выбора:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

router.post('/sort', (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);
    const sortRequest: SortRequest = req.body;
    
    if (typeof sortRequest.itemId !== 'number' || typeof sortRequest.newPosition !== 'number') {
      return res.status(400).json({ error: 'Неверные параметры сортировки' });
    }
    
    stateService.updateSortOrder(sessionId, sortRequest);
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обновлении сортировки:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

router.post('/sort-order', (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);
    const { sortOrder } = req.body;
    
    if (!Array.isArray(sortOrder)) {
      return res.status(400).json({ error: 'Неверный формат порядка сортировки' });
    }
    
    stateService.setSortOrder(sessionId, sortOrder);
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при установке порядка сортировки:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

router.post('/reorder', (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);
    const reorderRequest: ReorderRequest = req.body;
    
    if (
      typeof reorderRequest.toIndex !== 'number' || 
      typeof reorderRequest.itemId !== 'number'
    ) {
      return res.status(400).json({ error: 'Неверные параметры переупорядочивания' });
    }
    
    stateService.reorderItems(sessionId, reorderRequest);
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при переупорядочивании элементов:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

router.get('/count', (_req: Request, res: Response) => {
  try {
    const total = dataService.getTotalCount();
    res.json({ total });
  } catch (error) {
    console.error('Ошибка при получении количества:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

export default router;
