import React, { useState, useEffect } from 'react';
import { Node } from '../Node';
import { visualizeDijkstra } from '../../algorithms/dijkstra';
import { visualizeBfs } from '../../algorithms/bfs';
import { visualizeDfs } from '../../algorithms/dfs';
import './MazeSolver.css';

export default function MazeSolver() {
    const [grid, setGrid] = useState([]);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);
    const [dragStart, setDragStart] = useState(false);
    const [dragFinish, setDragFinish] = useState(false);
    const [startRow, setStartRow] = useState(NODE_START_ROW);
    const [startCol, setStartCol] = useState(NODE_START_COL);
    const [finishRow, setFinishRow] = useState(NODE_FINISH_ROW);
    const [finishCol, setFinishCol] = useState(NODE_FINISH_COL);

    useEffect(() => {
        const grid = initializeGrid();
        setGrid(grid);
    }, [])

    function resetGrid() {
        for (let row = 0; row < 25; row++) {
            for (let col = 0; col < 50; col++) {
                document.getElementById(`node-${row}-${col}`).className = 'node';
            }
        }
        const newGrid = initializeGrid();
        setGrid(newGrid);
        setStartRow(NODE_START_ROW);
        setStartCol(NODE_START_COL);
        setFinishRow(NODE_FINISH_ROW);
        setFinishCol(NODE_FINISH_COL);
    }

    function handleMouseDown(row, col) {
        if (grid[row][col].isStart) {
            setDragStart(true);
            setMouseIsPressed(true);
        }
        if (grid[row][col].isFinish) {
            setDragFinish(true);
            setMouseIsPressed(true);
        }
        if (!grid[row][col].isFinish && !grid[row][col].isStart) {
            const newGrid = initializeGridWithWall(grid, row, col);
            setGrid(newGrid);
            setMouseIsPressed(true);
        }
    }

    function handleMouseEnter(row, col) {
        if (!mouseIsPressed && !dragStart && !dragFinish) return;
        if (dragStart) {
            const newGrid = initializeGridWithNewStart(grid, row, col);
            setGrid(newGrid);
            setStartRow(row);
            setStartCol(col);
        }
        if (dragFinish) {
            const newGrid = initializeGridWithNewFinish(grid, row, col);
            setGrid(newGrid);
            setFinishRow(row);
            setFinishCol(col);
        }
        if (!dragStart && !dragFinish) {
            const newGrid = initializeGridWithWall(grid, row, col);
            setGrid(newGrid);
        }
    }

    function handleMouseLeave(row, col) {
        if (dragStart) {
            const newGrid = initializeGridWithNewStart(grid, row, col);
            setGrid(newGrid);
        }
        if (dragFinish) {
            const newGrid = initializeGridWithNewFinish(grid, row, col);
            setGrid(newGrid);
        }
        if (!dragStart && !dragFinish) {
            return;
        }
    }

    function handleMouseUp() {
        setMouseIsPressed(false);
        setDragStart(false);
        setDragFinish(false);
    }

    return (
        <div>
            <button onClick={() => resetGrid()}>
                Reset Map
            </button>
            <button onClick={() => visualizeDijkstra(grid, startRow, startCol, finishRow, finishCol)}>
                Visualize Dijkstra's Algorithm
            </button>
            <button onClick={() => visualizeBfs(grid, startRow, startCol, finishRow, finishCol)}>
                Visualize BFS Algorithm
            </button>
            <button onClick={() => visualizeDfs(grid, startRow, startCol, finishRow, finishCol)}>
                Visualize DFS Algorithm
            </button>
            <div className="grid">
                {grid && grid.map((row, rowIdx) => {
                    return (
                        <div key={rowIdx} className="grid-row">
                            {row.map((node, nodeIdx) => {
                                const { row, col, isStart, isFinish, isWall } = node;
                                return (
                                    <Node
                                        key={nodeIdx}
                                        row={row}
                                        col={col}
                                        isStart={isStart}
                                        isFinish={isFinish}
                                        isWall={isWall}
                                        mouseIsPressed={mouseIsPressed}
                                        onMouseDown={(row, col) => handleMouseDown(row, col)}
                                        onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                                        onMouseLeave={(row, col) => handleMouseLeave(row, col)}
                                        onMouseUp={() => handleMouseUp()}
                                    />
                                )
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

const NODE_START_ROW = 0;
const NODE_START_COL = 0;
const NODE_FINISH_ROW = 15;
const NODE_FINISH_COL = 15;

function initializeGrid() {
    const grid = [];
    for (let row = 0; row < 25; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
            currentRow.push(createNode(row, col));
        }
        grid.push(currentRow);
    }
    return grid;
}

function createNode(row, col) {
    return {
        row,
        col,
        isStart: row === NODE_START_ROW && col === NODE_START_COL,
        isFinish: row === NODE_FINISH_ROW && col === NODE_FINISH_COL,
        isWall: false,
        visited: false,
        distance: Infinity,
        previousNode: null
    }
}

const initializeGridWithWall = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const initializeGridWithNewStart = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isStart: !node.isStart,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const initializeGridWithNewFinish = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isFinish: !node.isFinish,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};