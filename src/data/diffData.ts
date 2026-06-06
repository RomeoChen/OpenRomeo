export interface DiffPoint {
  id: string
  type: '新增' | '修改' | '删除'
  box: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface DiffImage {
  id: number
  leftImage: string
  rightImage: string
  leftWidth: number
  leftHeight: number
  rightWidth: number
  rightHeight: number
  diffs: DiffPoint[]
}

// 颜色配置
export const diffColors = {
  新增: '#22c55e',
  修改: '#eab308',
  删除: '#ef4444',
}

// 生成 20+ 张模拟图片数据
export const diffImages: DiffImage[] = [
  {
    id: 1,
    leftImage: 'https://picsum.photos/seed/diff1/800/600',
    rightImage: 'https://picsum.photos/seed/diff1b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '1-1', type: '新增', box: { x: 120, y: 80, width: 150, height: 100 } },
      { id: '1-2', type: '修改', box: { x: 400, y: 200, width: 180, height: 120 } },
      { id: '1-3', type: '删除', box: { x: 600, y: 400, width: 120, height: 80 } },
    ],
  },
  {
    id: 2,
    leftImage: 'https://picsum.photos/seed/diff2/800/600',
    rightImage: 'https://picsum.photos/seed/diff2b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '2-1', type: '修改', box: { x: 50, y: 50, width: 200, height: 150 } },
      { id: '2-2', type: '新增', box: { x: 350, y: 300, width: 160, height: 100 } },
      { id: '2-3', type: '删除', box: { x: 550, y: 150, width: 140, height: 90 } },
      { id: '2-4', type: '新增', box: { x: 680, y: 450, width: 100, height: 70 } },
    ],
  },
  {
    id: 3,
    leftImage: 'https://picsum.photos/seed/diff3/800/600',
    rightImage: 'https://picsum.photos/seed/diff3b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '3-1', type: '删除', box: { x: 100, y: 100, width: 120, height: 80 } },
      { id: '3-2', type: '修改', box: { x: 300, y: 200, width: 200, height: 140 } },
      { id: '3-3', type: '新增', box: { x: 550, y: 350, width: 150, height: 100 } },
    ],
  },
  {
    id: 4,
    leftImage: 'https://picsum.photos/seed/diff4/800/600',
    rightImage: 'https://picsum.photos/seed/diff4b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '4-1', type: '新增', box: { x: 80, y: 120, width: 180, height: 110 } },
      { id: '4-2', type: '删除', box: { x: 320, y: 80, width: 140, height: 100 } },
      { id: '4-3', type: '修改', box: { x: 500, y: 250, width: 160, height: 130 } },
      { id: '4-4', type: '新增', box: { x: 150, y: 400, width: 200, height: 80 } },
    ],
  },
  {
    id: 5,
    leftImage: 'https://picsum.photos/seed/diff5/800/600',
    rightImage: 'https://picsum.photos/seed/diff5b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '5-1', type: '修改', box: { x: 200, y: 150, width: 220, height: 160 } },
      { id: '5-2', type: '删除', box: { x: 500, y: 100, width: 130, height: 90 } },
      { id: '5-3', type: '新增', box: { x: 50, y: 380, width: 170, height: 100 } },
    ],
  },
  {
    id: 6,
    leftImage: 'https://picsum.photos/seed/diff6/800/600',
    rightImage: 'https://picsum.photos/seed/diff6b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '6-1', type: '新增', box: { x: 100, y: 80, width: 150, height: 120 } },
      { id: '6-2', type: '修改', box: { x: 350, y: 180, width: 180, height: 140 } },
      { id: '6-3', type: '删除', box: { x: 600, y: 300, width: 120, height: 80 } },
      { id: '6-4', type: '新增', box: { x: 250, y: 420, width: 200, height: 90 } },
    ],
  },
  {
    id: 7,
    leftImage: 'https://picsum.photos/seed/diff7/800/600',
    rightImage: 'https://picsum.photos/seed/diff7b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '7-1', type: '修改', box: { x: 80, y: 100, width: 200, height: 150 } },
      { id: '7-2', type: '新增', box: { x: 400, y: 200, width: 160, height: 110 } },
      { id: '7-3', type: '删除', box: { x: 620, y: 400, width: 100, height: 70 } },
    ],
  },
  {
    id: 8,
    leftImage: 'https://picsum.photos/seed/diff8/800/600',
    rightImage: 'https://picsum.photos/seed/diff8b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '8-1', type: '删除', box: { x: 150, y: 80, width: 130, height: 100 } },
      { id: '8-2', type: '修改', box: { x: 350, y: 150, width: 190, height: 130 } },
      { id: '8-3', type: '新增', box: { x: 580, y: 280, width: 140, height: 90 } },
      { id: '8-4', type: '删除', box: { x: 100, y: 350, width: 180, height: 120 } },
    ],
  },
  {
    id: 9,
    leftImage: 'https://picsum.photos/seed/diff9/800/600',
    rightImage: 'https://picsum.photos/seed/diff9b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '9-1', type: '新增', box: { x: 80, y: 120, width: 170, height: 110 } },
      { id: '9-2', type: '修改', box: { x: 320, y: 200, width: 210, height: 150 } },
      { id: '9-3', type: '删除', box: { x: 580, y: 100, width: 130, height: 80 } },
    ],
  },
  {
    id: 10,
    leftImage: 'https://picsum.photos/seed/diff10/800/600',
    rightImage: 'https://picsum.photos/seed/diff10b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '10-1', type: '修改', box: { x: 100, y: 80, width: 190, height: 140 } },
      { id: '10-2', type: '新增', box: { x: 380, y: 180, width: 160, height: 100 } },
      { id: '10-3', type: '删除', box: { x: 600, y: 320, width: 120, height: 90 } },
      { id: '10-4', type: '修改', box: { x: 200, y: 400, width: 180, height: 80 } },
    ],
  },
  {
    id: 11,
    leftImage: 'https://picsum.photos/seed/diff11/800/600',
    rightImage: 'https://picsum.photos/seed/diff11b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '11-1', type: '新增', box: { x: 120, y: 150, width: 160, height: 100 } },
      { id: '11-2', type: '修改', box: { x: 350, y: 80, width: 200, height: 150 } },
      { id: '11-3', type: '删除', box: { x: 600, y: 250, width: 110, height: 80 } },
    ],
  },
  {
    id: 12,
    leftImage: 'https://picsum.photos/seed/diff12/800/600',
    rightImage: 'https://picsum.photos/seed/diff12b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '12-1', type: '删除', box: { x: 80, y: 100, width: 140, height: 90 } },
      { id: '12-2', type: '新增', box: { x: 300, y: 200, width: 180, height: 130 } },
      { id: '12-3', type: '修改', box: { x: 550, y: 350, width: 150, height: 100 } },
      { id: '12-4', type: '新增', box: { x: 150, y: 450, width: 200, height: 80 } },
    ],
  },
  {
    id: 13,
    leftImage: 'https://picsum.photos/seed/diff13/800/600',
    rightImage: 'https://picsum.photos/seed/diff13b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '13-1', type: '修改', box: { x: 100, y: 80, width: 210, height: 160 } },
      { id: '13-2', type: '删除', box: { x: 400, y: 180, width: 130, height: 100 } },
      { id: '13-3', type: '新增', box: { x: 580, y: 300, width: 140, height: 90 } },
    ],
  },
  {
    id: 14,
    leftImage: 'https://picsum.photos/seed/diff14/800/600',
    rightImage: 'https://picsum.photos/seed/diff14b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '14-1', type: '新增', box: { x: 80, y: 120, width: 170, height: 110 } },
      { id: '14-2', type: '修改', box: { x: 320, y: 200, width: 190, height: 140 } },
      { id: '14-3', type: '删除', box: { x: 560, y: 100, width: 150, height: 100 } },
      { id: '14-4', type: '新增', box: { x: 200, y: 380, width: 160, height: 90 } },
    ],
  },
  {
    id: 15,
    leftImage: 'https://picsum.photos/seed/diff15/800/600',
    rightImage: 'https://picsum.photos/seed/diff15b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '15-1', type: '修改', box: { x: 150, y: 80, width: 180, height: 130 } },
      { id: '15-2', type: '新增', box: { x: 400, y: 180, width: 160, height: 100 } },
      { id: '15-3', type: '删除', box: { x: 620, y: 320, width: 120, height: 80 } },
    ],
  },
  {
    id: 16,
    leftImage: 'https://picsum.photos/seed/diff16/800/600',
    rightImage: 'https://picsum.photos/seed/diff16b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '16-1', type: '删除', box: { x: 100, y: 150, width: 150, height: 100 } },
      { id: '16-2', type: '修改', box: { x: 330, y: 80, width: 200, height: 150 } },
      { id: '16-3', type: '新增', box: { x: 580, y: 250, width: 140, height: 110 } },
      { id: '16-4', type: '删除', box: { x: 250, y: 400, width: 180, height: 90 } },
    ],
  },
  {
    id: 17,
    leftImage: 'https://picsum.photos/seed/diff17/800/600',
    rightImage: 'https://picsum.photos/seed/diff17b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '17-1', type: '新增', box: { x: 120, y: 100, width: 160, height: 120 } },
      { id: '17-2', type: '修改', box: { x: 360, y: 200, width: 190, height: 140 } },
      { id: '17-3', type: '删除', box: { x: 600, y: 350, width: 130, height: 90 } },
    ],
  },
  {
    id: 18,
    leftImage: 'https://picsum.photos/seed/diff18/800/600',
    rightImage: 'https://picsum.photos/seed/diff18b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '18-1', type: '修改', box: { x: 80, y: 80, width: 200, height: 150 } },
      { id: '18-2', type: '新增', box: { x: 350, y: 180, width: 170, height: 100 } },
      { id: '18-3', type: '删除', box: { x: 580, y: 300, width: 140, height: 80 } },
      { id: '18-4', type: '修改', box: { x: 150, y: 420, width: 190, height: 90 } },
    ],
  },
  {
    id: 19,
    leftImage: 'https://picsum.photos/seed/diff19/800/600',
    rightImage: 'https://picsum.photos/seed/diff19b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '19-1', type: '新增', box: { x: 100, y: 120, width: 180, height: 110 } },
      { id: '19-2', type: '删除', box: { x: 350, y: 80, width: 150, height: 100 } },
      { id: '19-3', type: '修改', box: { x: 550, y: 200, width: 160, height: 130 } },
    ],
  },
  {
    id: 20,
    leftImage: 'https://picsum.photos/seed/diff20/800/600',
    rightImage: 'https://picsum.photos/seed/diff20b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '20-1', type: '修改', box: { x: 120, y: 80, width: 190, height: 140 } },
      { id: '20-2', type: '新增', box: { x: 380, y: 180, width: 160, height: 100 } },
      { id: '20-3', type: '删除', box: { x: 600, y: 280, width: 130, height: 90 } },
      { id: '20-4', type: '新增', box: { x: 200, y: 380, width: 170, height: 80 } },
    ],
  },
  {
    id: 21,
    leftImage: 'https://picsum.photos/seed/diff21/800/600',
    rightImage: 'https://picsum.photos/seed/diff21b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '21-1', type: '删除', box: { x: 80, y: 100, width: 150, height: 100 } },
      { id: '21-2', type: '修改', box: { x: 300, y: 180, width: 200, height: 150 } },
      { id: '21-3', type: '新增', box: { x: 560, y: 350, width: 140, height: 90 } },
    ],
  },
  {
    id: 22,
    leftImage: 'https://picsum.photos/seed/diff22/800/600',
    rightImage: 'https://picsum.photos/seed/diff22b/800/600',
    leftWidth: 800,
    leftHeight: 600,
    rightWidth: 800,
    rightHeight: 600,
    diffs: [
      { id: '22-1', type: '新增', box: { x: 100, y: 80, width: 170, height: 120 } },
      { id: '22-2', type: '修改', box: { x: 340, y: 150, width: 190, height: 140 } },
      { id: '22-3', type: '删除', box: { x: 590, y: 300, width: 130, height: 80 } },
      { id: '22-4', type: '修改', box: { x: 180, y: 420, width: 200, height: 90 } },
    ],
  },
]
