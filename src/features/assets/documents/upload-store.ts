import { create } from 'zustand'

export type UploadStatus = 'uploading' | 'success' | 'error'

export interface UploadItem {
  id: string
  assetId: string
  assetCode: string
  fileName: string
  docType: string
  sizeBytes: number
  loaded: number
  speed: number
  status: UploadStatus
  errorMessage?: string
}

interface UploadState {
  items: UploadItem[]
  collapsed: boolean
  add: (item: UploadItem) => void
  patch: (id: string, partial: Partial<UploadItem>) => void
  remove: (id: string) => void
  clearFinished: () => void
  dismissAll: () => void
  setCollapsed: (collapsed: boolean) => void
}

/**
 * Hàng đợi tải lên chứng từ, hiển thị ở panel góc dưới-phải (kiểu Larksuite). Tách khỏi dialog để tệp
 * vẫn tải khi người dùng đóng dialog hoặc chuyển trang.
 */
export const useUploadStore = create<UploadState>()((set) => ({
  items: [],
  collapsed: false,
  add: (item) =>
    set((state) => ({ items: [item, ...state.items], collapsed: false })),
  patch: (id, partial) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...partial } : item
      ),
    })),
  remove: (id) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  clearFinished: () =>
    set((state) => ({
      items: state.items.filter((item) => item.status === 'uploading'),
    })),
  dismissAll: () => set({ items: [] }),
  setCollapsed: (collapsed) => set({ collapsed }),
}))
