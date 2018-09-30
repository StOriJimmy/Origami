'use strict';

import * as Geometry from './geometry.js'

// points are in array syntax
// point array is in counter-clockwise winding
function contains(pointArray, point){
	// let epsilon = 0.00000000001;
	let epsilon = 0.00000001;
	return pointArray.map( (p,i,arr) => {
		var nextP = arr[(i+1)%arr.length];
		var a = [ nextP[0]-p[0], nextP[1]-p[1] ];
		var b = [ point[0]-p[0], point[1]-p[1] ];
		return a[0]*b[1]-a[1]*b[0] > -epsilon;
	}).reduce((prev,curr) => {return prev && curr;},true)
}


var squareFoldFile = {
	"file_spec": 1.1,
	"file_creator": "Rabbit Ear",
	"file_author": "",
	"file_classes": ["singleModel"],
	"vertices_coords": [[0,0],[1,0],[1,1],[0,1]],
	"edges_vertices": [[0,1],[1,2],[2,3],[3,0]],
	"edges_assignment": ["B","B","B","B"],
	"faces_vertices": [[0,1,2,3]],
	"faces_layer": [0],
	"faces_matrix": [[1, 0, 0, 1, 0, 0]],
	"file_frames": [{
		"parent": 0,
		"inherit": true
	}]
};

var oneFoldFoldFile = {
	"file_spec": 1.1,
	"file_creator": "Rabbit Ear",
	"file_author": "Robby Kraft",
	"file_classes": ["singleModel"],
	"frame_attributes": ["2D"],
	"frame_title": "one valley crease",
	"frame_classes": ["foldedState"],
	"vertices_coords": [
		[0.62607055447, 1.172217339808],
		[1.182184366474, 0.341111192497],
		[1, 1],
		[0, 1],
		[1, 0.21920709774914016],
		[0, 0.7532979469531602]
	],
	"vertices_vertices": [[1,3], [4,0], [3,4], [0,2], [2,5,1], [0,4,3]],
	"vertices_faces": [[0], [0], [1], [1], [1,0], [0,1]],
	"edges_vertices": [[0,1], [1,4], [4,5], [5,0], [4,2], [2,3], [3,5]],
	"edges_faces": [[0], [0], [1,0], [0], [1], [1], [1]],
	"edges_assignment": ["B","B","V","B","B","B","B"],
	"edges_foldAngle": [0, 0, 180, 0, 0, 0, 0],
	"faces_vertices": [[0,1,4,5], [2,3,5,4]],
	"faces_edges": [[0,1,2,3], [5,6,2,4]],
	"faces_layer": [1,0],
	"faces_matrix": [
		[0.5561138120038558, -0.8311061473112445, -0.8311061473112445, -0.5561138120038558, 0.6260705544697115, 1.172217339807961],
		[1, 0, 0, 1, 0, 0]
	],
	"file_frames": [{
		"frame_classes": ["creasePattern"],
		"parent": 0,
		"inherit": true,
		"vertices_coords": [[0,0], [1,0], [1,1], [0,1], [1,0.21920709774914016], [0,0.7532979469531602]],
		"edges_foldAngle": [0, 0, 0, 0, 0, 0, 0],
		"faces_layer": [0,1],
		"faces_matrix": [[1,0,0,1,0,0], [1,0,0,1,0,0]],
	}]
};


export default class Origami{

	constructor(){
		this.oneFold = oneFoldFoldFile;
		this.square = squareFoldFile;
	}

	static prepareFoldFile(foldFile){
		let dontCopy = ["parent", "inherit"];
		let fold = JSON.parse(JSON.stringify(foldFile));
		if(fold.file_frames != undefined){
			var thing = key => !dontCopy.includes(key);
			let keys = Object.keys(fold.file_frames[0]).filter(key => !dontCopy.includes(key))
			// console.log("copying over " + keys.join(' ') + " from frame[0] to main");
			keys.forEach(key => fold[key] = fold.file_frames[0][key] )
		}
		fold.file_frames = null;
		return fold;
	}

	static crease(foldFile, line, point){

		// var foldFile = Origami.prepareFoldFile(masterFoldFile);

		// 1. vertices_intersections
    // input is a fold format JSON and a Robby line
    // output is an faces_ array of pairs of [x, y] points, or undefined

    var faces_clipLines = Origami.clip_faces_at_edge_crossings(foldFile, line);
		// console.log(faces_clipLines)

		// return;

		// var returnObject = {
		// 	"vertices_coords_flat": [[0,0], [1,0], [1,1], [0,1], [1,0.21920709], [0,0.75329794]],
		// 	"vertices_coords_fold": [[0,0], [1,0], [1,1], [0,1], [1,0.21920709], [0,0.75329794]],
		// 	"sides_faces_vertices": [
		// 		[[0,1,4,5], [2,3,5,4]],
		// 		[[null,1,4,5], [2,3,5,4]],
		// 	]
		// }

    // 3.5. draw lines on crease pattern
    //  - using faces_lines, draw these on crease pattern
    // 
    // now user clicks on a face:
    // -------
    // we loop through faces, checking if user clicked in face. choose top most one f
    // then check which side was click by checking click intersection with faces_pieces[f]
    // NOW WE KNOW which side1 or side2 inside all of faces_pieces will be the one that moves

    // console.log(foldFile);

    var nf = foldFile.faces_vertices.length;
    // if (point == undefined) point = [0.6, 0.6];
    if (point != undefined) {
      // console.log("Jason Code!");
      var splitFaces = {
        vertices_coords: foldFile.vertices_coords,
        sides_faces_vertices: [Array(nf), foldFile.faces_vertices]
      }

      var split_faces = Origami.split_folding_faces(
          foldFile, 
          splitFaces,	
          foldFile.vertices_coords,  
          point
      );
    }
    // point is place where user clicked
    // unfold must have faces_layer as a permutation of the face indices


    // var newUnfolded = foldMovingFaces(
    //     foldFile, 
    //     // faces_splitFaces, 
    //     Array(n).fill(0, n, [undefined,[1,2,3,4]]),
    //     newVertices_coords, 
    //     Array(n).fill(0, n, [0,1])
    // );

		// var creasePattern = new CreasePattern().importFoldFile(foldFile);
		// creasePattern.crease(line);
	}


	// input: fold file and line
	// output: dict keys: two vertex indices defining an edge (as a string: "4 6")
	//         dict vals: [x, y] location of intersection between the two edge vertices
	static clip_faces_at_edge_crossings(foldFile, line){
		// which face does the vertex lie in (just one of them)
		let vertexInFace = foldFile.vertices_coords.map(v => -1)
		vertexInFace = vertexInFace.map(function(v,i){
			for(var f = 0; f < foldFile.faces_vertices.length; f++){
				if(foldFile.faces_vertices[f].includes(i)){ return f; }
			}
		},this);

		// from face vertex indices, create faces with vertex geometry
		let facesVertices = foldFile.faces_vertices.map( vIndices => {
			return vIndices.map( vI => foldFile.vertices_coords[vI])
		})

		// generate one clip line per face, or none if there is no intersection
		let facePolys = facesVertices.map(vertices => {
			// convex hull algorithm turns faces into a convex polygon object
			let poly = new Geometry.ConvexPolygon();
			poly.edges = vertices.map((el,i,verts) => {
				let nextEl = verts[ (i+1)%verts.length ];
				return new Geometry.Edge(el[0], el[1], nextEl[0], nextEl[1]);
			});
			return poly;
		})

		// for every face, we have one clipped crease edge or undefined if no intersection
		let clippedFacesLine = facePolys.map(function(poly, i){
			// return poly.clipLine( line.transform(matrices[i].inverse()) );
			return poly.clipLine( line );
		},this).map(function(edge){
			// convert to [ [x,y], [x,y] ]. or undefined if no intersection
			if(edge != undefined){return [[edge.nodes[0].x,edge.nodes[0].y],[edge.nodes[1].x,edge.nodes[1].y]];}
			return undefined;
		},this);

		// build result dictionary
		let edgeCrossings = {}
		clippedFacesLine.forEach((clip, f) => {
			if(clip != undefined){
				facePolys[f].edges.forEach((edge, eI) => {
					let foundIndex = undefined;
					if(edge.collinear( {x:clip[0][0], y:clip[0][1]} )){ foundIndex = 0; }
					if(edge.collinear( {x:clip[1][0], y:clip[1][1]} )){ foundIndex = 1; }
					if(foundIndex != undefined){
						let fVI = foldFile.faces_vertices[f];
						let key = [fVI[eI], fVI[(eI+1)%fVI.length]].sort(function(a,b){return a-b;}).join(" ");
						edgeCrossings[key] = {'clip':clip[foundIndex], 'face':f};
					}
				})
			}
		})

		// deep copy components
		let new_vertices_coords = JSON.parse(JSON.stringify(foldFile.vertices_coords));
		// let new_edges_vertices = JSON.parse(JSON.stringify(foldFile.edges_vertices));
		let new_faces_vertices = JSON.parse(JSON.stringify(foldFile.faces_vertices));
		// these will depricate the entries listed below, requiring rebuild:
		//   "vertices_vertices", "vertices_faces"
		//   "edges_faces", "edges_assignment", "edges_foldAngle", "edges_length"
		//   "faces_edges", "faces_layer", "faceOrders", "faces_matrix"

		// move vertex geometry from edgeCrossings into new_vertices_coords.
		// update edgeCrossings with index pointer to location in new_vertices_coords.
		for(let key in edgeCrossings){
			if(edgeCrossings.hasOwnProperty(key)){
				new_vertices_coords.push( edgeCrossings[key].clip )
				edgeCrossings[key].clip = new_vertices_coords.length-1
				vertexInFace[new_vertices_coords.length-1] = edgeCrossings[key].face;
			}
		}

		// forget edges for now
		// for(let key in edgeCrossings){
		// 	if(edgeCrossings.hasOwnProperty(key)){
		// 		let edges = key.split(' ').map( e => parseInt(e) )
		// 		// add new edges to edge array. multi step.
		// 		// 1. filter out the edge which has a new point in between everything.
		// 		new_edges_vertices = new_edges_vertices.filter( el => !(el.includes(edges[0]) && el.includes(edges[1])) )
		// 		new_edges_vertices.push([edges[0], edgeCrossings[key]])
		// 		new_edges_vertices.push([edgeCrossings[key], edges[1]])
		// 	}
		// }

		let facesSubstitutions = []
		clippedFacesLine.map( (clipLine,i) => {
			// this is a face that has been identified as containing a crossing
			// we need to remove it and replace it with 2 faces
			if(clipLine != undefined){
				var newFaces = [ [], [] ]
				var newFaceI = 0;

				// walk around a face. using edges
				foldFile.faces_vertices[i].forEach( (vertex,i,vertexArray) => {
					let nextVertex = vertexArray[(i+1)%vertexArray.length];

					var key = [vertex, nextVertex].sort( (a,b) => a-b ).join(' ')
					// let key = edgeArray.slice().sort(function(a,b){return a-b;}).join(' ')
					if(edgeCrossings[key]){
						var intersection = edgeCrossings[key].clip;
						newFaces[newFaceI].push(intersection)
						newFaceI = (newFaceI+1)%2; // flip bit
						newFaces[newFaceI].push(intersection)
						newFaces[newFaceI].push(nextVertex)
					} else{
						newFaces[newFaceI].push(nextVertex)
					}
				})
			}
			facesSubstitutions[i] = newFaces
		})

		var stay = [];
		var move = [];
		for(var i in facesSubstitutions){
			if(facesSubstitutions[i] == undefined){
				stay.push(new_faces_vertices[i]);
				move.push(undefined);
			} else{
				stay.push(facesSubstitutions[i][0]);
				move.push(facesSubstitutions[i][1]);
			}
		}

		let matrices = foldFile["faces_matrix"].map(n => 
			new Geometry.Matrix(n[0],n[1],n[2],n[3],n[4],n[5]).inverse()
		)
		let new_vertices_coords_cp = new_vertices_coords.map((point,i) => {
			return new Geometry.XY(point).transform(matrices[ vertexInFace[i] ])
		}).map( p => [p.x, p.y])

		return {
			"vertices_coords_fold": new_vertices_coords,
			"vertices_coords_flat": new_vertices_coords_cp,
			"sides_faces_vertices": [stay, move]
		}
	}

  static contains(points, point) {
    points = points.map(p => ({x: p[0], y: p[1]}));
    point  = {x: point[0], y: point[1]};
    return RabbitEar.Geometry.ConvexPolygon
      .convexHull(points).contains(point);
  }

  static top_face_under_point(fold, point) {
	  // get index of highest layer face which intersects point
	  let top_fi = fold.faces_vertices.reduce(
	    (top_fi, vertices_index, fi) => {
        let points = vertices_index.map(i => fold.vertices_coords[i]);
        let face_contains_point = Origami.contains(points, point);
        if (face_contains_point) {
          // console.log("Over face " + fi);
          if ((top_fi == undefined) ||
              (fold.faces_layer[top_fi] < fold.faces_layer[fi])) {
            top_fi = fi;
          }
        }
        return top_fi;
      }, undefined);
	  if (top_fi === undefined) {
	    // console.log("You didn't touch a face...");
	    return undefined;
	  }
	  // console.log("You touched face " + top_fi + "!");
    return top_fi;
  }

	static split_folding_faces(fold, splitFaces, line, point) {
    // assumes point not on line
    
    point = [point.x, point.y];
    let vertices_coords = splitFaces.vertices_coords;
    let sides_faces     = splitFaces.sides_faces_vertices;

    let fi = Origami.top_face_under_point(fold, point);
    if (fi !== undefined) {
      for (var side of [0, 1]) {
        let vertices_index = sides_faces[fi][side];
        if (vertices_index !== undefined) {
          let points = vertices_index.map(i => vertices_coords[i]);
          if (Origami.contains(points, point)) break;
        }
      }
      // console.log("On side " + side);
    }

	  return;

	  let faces_vertices         = fold.faces_vertices;
	  let faces_layer            = fold.faces_layer;

	  // make faces_faces
	  let nf = faces_vertices.length;
	  let faces_faces = Array.from(Array(nf)).map(() => []);
	  let edgeMap = {};
	  faces_vertices.forEach((vertices, idx1) => {
	    n = vertices.length;
	    vertices.forEach((u, i, vs) => {
	      v = vs[(i + 1) % n];
	      if (v < u) {
	        [u, v] = [v, u];
	      }
	      let key = u + "," + v;
	      if (key in edgeMap) {
	        idx2 = edgeMap[key];
	        faces_faces[idx1].push(idx2);
	        faces_faces[idx2].push(idx1);
	      } else {
	        edgeMap[key] = idx1;
	      }
	    }); 
	  });

	  let faces_splitFaces_move = Array.from(Array(nf)).map(() => Array(2).map(() => false));
	  faces_splitFaces_move[touched.idx][touched.side] = true;
	  
	  // 

	  // for (var i = 0; i < faces.length; i++) {
	  //    vertices   = faces_vertices[i];
	  //    layer      = faces_layer[i];
	  //    splitFaces = faces_splitFaces[i];
	  //    move       = faces_splitFaces_move[i];
	  // }
	  return faces_splitFaces_move;
	}


}

