// SpawnManager.js — Chunk pooling, spawn cursor, scroll, recycle, safety pass, modifier bias

class SpawnManager {
    constructor(scene, gameManager) {
        this._scene = scene;
        this._gameManager = gameManager;

        // Pool: map of chunkId -> array of inactive containers
        this._pools = {};
        this._activeChunks = [];

        // Collidables group — flat group for physics overlap
        this.collidables = scene.physics.add.group({ allowGravity: false });

        // Spawn cursor — Y position where next chunk spawns (scrolls downward)
        this._spawnCursorY = 0;

        // Modifier bias
        this._biasModifier = null;

        // Build pools
        for (const def of CHUNK_DATA) {
            this._pools[def.id] = [];
        }

        EventBus.on(EVENTS.GAME_START, this.resetPool, this);
        EventBus.on(EVENTS.GAME_RESTART, this.resetPool, this);
    }

    resetPool() {
        // Return all active chunks
        for (const chunk of this._activeChunks) {
            this._releaseChunk(chunk);
        }
        this._activeChunks = [];
        this._spawnCursorY = -GAME_CONFIG.spawn.lookAheadDistance;
        this._biasModifier = null;
    }

    setModifierBias(type) {
        this._biasModifier = type;
        EventBus.emit(EVENTS.BIAS_CHANGED, type);
    }

    update(dt) {
        if (this._gameManager.currentState !== 'running') return;

        const speed = this._gameManager.worldSpeed;
        const delta = speed * dt;

        // Scroll active chunks downward
        for (const chunk of this._activeChunks) {
            chunk.container.y += delta;
            // Also update physics bodies of children
            for (const child of chunk.children) {
                if (child.active) {
                    child.y = chunk.container.y + child.getData('yOffset');
                }
            }
        }
        this._spawnCursorY += delta;

        // Recycle expired chunks
        const recycleY = GAME_CONFIG.canvas.height + GAME_CONFIG.spawn.recycleBuffer;
        for (let i = this._activeChunks.length - 1; i >= 0; i--) {
            if (this._activeChunks[i].container.y > recycleY) {
                this._releaseChunk(this._activeChunks[i]);
                this._activeChunks.splice(i, 1);
            }
        }

        // Spawn new chunks
        while (this._spawnCursorY < -GAME_CONFIG.spawn.recycleBuffer) {
            const def = this._selectChunk();
            if (!def) break;
            this._spawnChunk(def);
        }
    }

    _selectChunk() {
        const totalDist = this._gameManager.totalDistance;

        // Filter by milestone
        let eligible = CHUNK_DATA.filter(d => totalDist >= d.minDistanceMilestone * 16);

        // Apply modifier bias: Dash suppresses Dense
        if (this._biasModifier === 'dash') {
            const filtered = eligible.filter(d => !d.tags.includes('Dense'));
            if (filtered.length > 0) eligible = filtered;
        }

        if (eligible.length === 0) return null;
        return eligible[Math.floor(Math.random() * eligible.length)];
    }

    _spawnChunk(def) {
        // Try pool first
        let chunk = this._pools[def.id]?.pop();

        if (!chunk) {
            chunk = this._createChunk(def);
        }

        // Position
        chunk.container.y = this._spawnCursorY;
        chunk.container.setVisible(true);

        // Reactivate all children
        for (const child of chunk.children) {
            child.setActive(true).setVisible(true);
            child.y = chunk.container.y + child.getData('yOffset');
            child.x = child.getData('laneX');
            this.collidables.add(child);
        }

        // Safety pass: if all 3 lanes have hazards, swap center to coin
        this._applySafetyPass(chunk);

        this._activeChunks.push(chunk);
        this._spawnCursorY -= def.height;
    }

    _createChunk(def) {
        const container = this._scene.add.container(160, 0);
        container.setDepth(5);
        container.setVisible(false);

        const children = [];
        for (const childDef of def.children) {
            const laneX = GAME_CONFIG.lanes.positions[childDef.lane];
            const textureKey = this._getTextureKey(childDef.type);

            const sprite = this._scene.physics.add.sprite(laneX, 0, textureKey);
            sprite.setDepth(5);
            sprite.body.setAllowGravity(false);
            sprite.body.setImmovable(true);

            sprite.setData('type', childDef.type);
            sprite.setData('lane', childDef.lane);
            sprite.setData('yOffset', childDef.yOffset);
            sprite.setData('laneX', laneX);
            sprite.setData('chunkId', def.id);
            sprite.setActive(false).setVisible(false);

            children.push(sprite);
        }

        return { container, children, defId: def.id };
    }

    _getTextureKey(type) {
        switch (type) {
            case 'hazard': return 'hazard-block';
            case 'coin':   return 'coin';
            case 'dash':   return 'collectible-dash';
            case 'shield': return 'collectible-shield';
            case 'surge':  return 'collectible-surge';
            default:       return 'coin';
        }
    }

    _applySafetyPass(chunk) {
        const hazardLanes = new Set();
        let centerHazard = null;

        for (const child of chunk.children) {
            if (child.getData('type') === 'hazard') {
                const lane = child.getData('lane');
                hazardLanes.add(lane);
                if (lane === 1) centerHazard = child;
            }
        }

        // If all 3 lanes blocked, swap center hazard to coin
        if (hazardLanes.size >= 3 && centerHazard) {
            centerHazard.setTexture('coin');
            centerHazard.setData('type', 'coin');
        }
    }

    _releaseChunk(chunk) {
        chunk.container.setVisible(false);
        for (const child of chunk.children) {
            child.setActive(false).setVisible(false);
            this.collidables.remove(child);
        }
        if (!this._pools[chunk.defId]) this._pools[chunk.defId] = [];
        this._pools[chunk.defId].push(chunk);
    }

    destroy() {
        EventBus.off(EVENTS.GAME_START, this.resetPool, this);
        EventBus.off(EVENTS.GAME_RESTART, this.resetPool, this);
    }
}
