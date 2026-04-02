// ChunkData.js — Chunk definitions (replaces Unity ChunkDefinition ScriptableObjects + prefabs)
// Lane 0 = left (128px), Lane 1 = center (160px), Lane 2 = right (192px)
// Types: 'hazard', 'coin', 'dash', 'shield', 'surge'
// Tags: 'Dense', 'Safe' (untagged chunks have empty array)
// yOffset is relative to chunk top, in pixels (Unity units × 16)

const CHUNK_DATA = [
    {
        id: 'sparse1',
        tags: [],
        minDistanceMilestone: 0,
        height: 96,   // 6 units × 16
        children: [
            { lane: 0, type: 'coin',   yOffset: 48 },
            { lane: 1, type: 'coin',   yOffset: 48 },
            { lane: 2, type: 'hazard', yOffset: 48 }
        ]
    },
    {
        id: 'sparse2',
        tags: [],
        minDistanceMilestone: 0,
        height: 96,
        children: [
            { lane: 0, type: 'dash',  yOffset: 48 },
            { lane: 2, type: 'coin',  yOffset: 48 }
        ]
    },
    {
        id: 'dense1',
        tags: ['Dense'],
        minDistanceMilestone: 0,
        height: 96,
        children: [
            { lane: 0, type: 'hazard', yOffset: 48 },
            { lane: 1, type: 'coin',   yOffset: 48 },
            { lane: 2, type: 'hazard', yOffset: 48 }
        ]
    },
    {
        id: 'dense2',
        tags: ['Dense'],
        minDistanceMilestone: 0,
        height: 96,
        children: [
            { lane: 0, type: 'hazard', yOffset: 48 },
            { lane: 1, type: 'hazard', yOffset: 48 },
            { lane: 2, type: 'coin',   yOffset: 48 }
        ]
    },
    {
        id: 'safe',
        tags: ['Safe'],
        minDistanceMilestone: 0,
        height: 96,
        children: [
            { lane: 0, type: 'coin', yOffset: 48 },
            { lane: 1, type: 'coin', yOffset: 48 },
            { lane: 2, type: 'coin', yOffset: 48 }
        ]
    }
];
