export const CELL_SIZE = 50;

export enum Resources {
    IRON    = 'iron',
    STONE   = 'stone',
    GOLD    = 'gold',
    EMPTY   = ''
}

export enum CellTypes {
    IRON_DEPOSIT    = 'iron-deposit',
    MOUNTAIN        = 'mountain',
    CASTLE          = 'castle',
    EMPTY           = ''
}

export const MINABLE_CELLS = [
    CellTypes.IRON_DEPOSIT,
    CellTypes.MOUNTAIN
];

export enum CharTypes {
    PAWN    = 'character'
}

export enum CharActions {
    MOVE    = 'move',
    MINE    = 'mine',
    DROP    = 'drop'
}

export enum CharStatus {
    IDLE    = '',
    MINING  = 'mining'
}

export enum CharFacings {
    NONE    = '',
    UP  = 'up',
    DOWN  = 'down',
    LEFT  = 'left',
    RIGHT  = 'right'
}

export class Point {
    x: number;
    y: number;

    static equals(e1: Point, e2: Point) {
        if (e1 === null) {
            return e2 === null;
        }
        if (e2 === null) {
            return false;
        }
        return e1.x === e2.x && e1.y === e2.y;
    }
}

export class Cell extends Point {
    type: CellTypes;
    amount?: number;

    static shouldRedraw(e1: Cell, e2: Cell) {
        return !super.equals(e1, e2)
            || e1.type !== e2.type;
    }

    static equals(e1: Cell, e2: Cell) {
        return super.equals(e1, e2)
            && e1.type === e2.type
            && e1.amount === e2.amount;
    }

    static same(e1: Character, e2: Character) {
        return super.equals(e1, e2);
    }
}

export class Character extends Point {
    type: CharTypes;
    status: CharStatus;
    facing: CharFacings;
    id: string;
    carrying: Resources;

    static shouldRedraw(e1: Character, e2: Character) {
        return !super.equals(e1, e2)
            || e1.type !== e2.type
            || e1.status !== e2.status
            || e1.facing !== e2.facing;
    }

    static equals(e1: Character, e2: Character) {
        return super.equals(e1, e2)
            && e1.id === e2.id
            && e1.type === e2.type
            && e1.status === e2.status
            && e1.facing === e2.facing
            && e1.carrying === e2.carrying;
    }

    static same(e1: Character, e2: Character) {
        return e1.id === e2.id;
    }
}
