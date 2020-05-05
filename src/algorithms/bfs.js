// Breadth first search algorithm will start at a node, list all
// of the node's neighbors in an array, and check each of the neighbors, 
// while adding neighbor's neighbors in the list
// Does not guarantee the shortest path for obvious reason

export function bfs(grid, startNode, finishNode) {
    // Initialize an empty array to track nodes that I will be visiting in order
    const nodesVisitedInOrder = [];
    // Initialize an empty array, this will keep track all the nodes we haven't visit yet
    const unvisitedNeighbors = [];
    // And push startNode to it, because we will start at startNode
    startNode.visited = true;
    unvisitedNeighbors.push(startNode);
    // As long as finishNode isn't found, we'll keep searching until there are no more things to look for
    while (unvisitedNeighbors.length > 0) {
        // Grab the first node on unvisitedNeighbors, and its row and col
        const currNode = unvisitedNeighbors.shift();
        console.log(currNode.row + "," + currNode.col);
        // If it's wall - sorry, we interrupted
        if (currNode.isWall === true) continue;
        // But if it's not a wall, then we push it to visited nodes
        
        
        nodesVisitedInOrder.push([currNode.row, currNode.col]);        
        
        // Now, if currNode is the finishNode, we are done
        if (currNode === finishNode) {
            return nodesVisitedInOrder;
        }
        
        // Otherwise we need to push its unvisited neighbors to unvisitedNeighbors
        const neighbors = getUnvisitedNeighbors(currNode, grid);
        for (const neighbor of neighbors) {
            neighbor.previousNodeX = currNode.row;
            neighbor.previousNodeY = currNode.col;
            neighbor.visited = true;
            unvisitedNeighbors.push(neighbor);
        }
    }
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    return neighbors.filter(neighbor => !neighbor.visited);
}

function getShortestNodePath(grid, finishNode) {
    const shortestPath = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        shortestPath.unshift(currentNode);
        if (currentNode.previousNodeX === null) break;
        currentNode = grid[currentNode.previousNodeX][currentNode.previousNodeY];
    }
    return shortestPath;
}

function animateBfs(grid, orderedVisitedNodes, orderedNodesOnShortestPath) {
    for (let i = 0; i < orderedVisitedNodes.length; i++) {
        if (i === orderedVisitedNodes.length - 1) {
            setTimeout(() => {
                animateShortestPath(orderedNodesOnShortestPath);
            }, 10 * i);
        }
        setTimeout(() => {
            var [x, y] = orderedVisitedNodes[i];
            const node = grid[x][y];
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
        }, 10 * i);
    }
}

function animateShortestPath(orderedNodesOnShortestPath) {
    for (let i = 0; i < orderedNodesOnShortestPath.length; i++) {
        setTimeout(() => {
            const node = orderedNodesOnShortestPath[i];
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
        }, 50 * i)
    }
}

export function visualizeBfs(grid, startRow, startCol, finishRow, finishCol) {
    const startNode = grid[startRow][startCol];
    const finishNode = grid[finishRow][finishCol];
    console.log("start");
    const orderedVisitedNodes = bfs(grid, startNode, finishNode);
    console.log("length:" + orderedVisitedNodes.length);
    const orderedNodesOnShortestPath = getShortestNodePath(grid, finishNode);
    console.log("length:" + orderedNodesOnShortestPath.length);
    animateBfs(grid, orderedVisitedNodes, orderedNodesOnShortestPath);
}