/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, type Simulation } from "d3-force";
import type { NodeModel, RelationshipModel } from "../types";
import {
  DEFAULT_ALPHA,
  DEFAULT_ALPHA_MIN,
  EXTRA_TICKS_PER_RENDER,
  FORCE_CENTER_X,
  FORCE_CENTER_Y,
  FORCE_CHARGE,
  FORCE_COLLIDE_RADIUS,
  FORCE_LINK_DISTANCE,
  MAX_PRECOMPUTED_TICKS,
  VELOCITY_DECAY,
} from "./constants";

export class ForceSimulation {
  simulation: Simulation<NodeModel, RelationshipModel>;
  simulationTimeout: null | number = null;
  tick = 0;
  constructor(render: () => void, simulation?: ForceSimulation["simulation"]) {
    this.simulation =
      simulation ??
      forceSimulation<NodeModel, RelationshipModel>()
        .velocityDecay(VELOCITY_DECAY)
        .force("charge", forceManyBody().strength(FORCE_CHARGE))
        .force("centerX", forceX(0).strength(FORCE_CENTER_X))
        .force("centerY", forceY(0).strength(FORCE_CENTER_Y))
        .alphaMin(DEFAULT_ALPHA_MIN)
        .on("tick", () => {
          this.simulation.tick(EXTRA_TICKS_PER_RENDER);
          render();
        })
        .stop();
  }

  updateNodes(nodes: NodeModel[]): void {
    // const radius = (nodes.length * LINK_DISTANCE) / (Math.PI * 2);
    // const center = {
    //   x: 0,
    //   y: 0,
    // };
    // circularLayout(nodes, center, radius);
    this.simulation.nodes(nodes).force("collide", forceCollide<NodeModel>().radius(FORCE_COLLIDE_RADIUS));
  }

  updateRelationships(
    relationships: RelationshipModel[],
    distance: number | typeof FORCE_LINK_DISTANCE = FORCE_LINK_DISTANCE,
  ): void {
    this.simulation.force(
      "link",
      forceLink<NodeModel, RelationshipModel>(relationships)
        .id((nm) => nm.node.id)
        .distance(distance),
    );
  }

  precomputeAndStart(onEnd: () => void = () => undefined): void {
    this.simulation.stop();

    let precomputeTicks = 0;
    const start = performance.now();
    while (performance.now() - start < 250 && precomputeTicks < MAX_PRECOMPUTED_TICKS) {
      this.simulation.tick(1);
      precomputeTicks += 1;
      if (this.simulation.alpha() <= this.simulation.alphaMin()) {
        break;
      }
    }

    this.simulation.restart().on("end", () => {
      onEnd();
      this.simulation.on("end", null);
    });
  }

  restart(onEnd: () => void = () => undefined): void {
    this.simulation
      .alpha(DEFAULT_ALPHA)
      .restart()
      .on("end", () => {
        onEnd();
        this.simulation.on("end", null);
      });
  }
}
